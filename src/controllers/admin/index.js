const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const shortid = require("shortid");

const listAmin = (admin) => {
  let list_admin = [];
  let admins;
  admins = admin.filter(
    (admin) => admin.role === "admin" || admin.role === "super-admin"
  );
  for (let _admin of admins) {
    list_admin.push({
      _id: _admin._id,
      firstName: _admin.firstName,
      lastName: _admin.lastName,
      fullName: _admin.fullName,
      email: _admin.email,
      role: _admin.role,
    });
  }
  return list_admin;
};

// dangky
exports.signup = (req, res) => {
  try {
    Admin.findOne({ email: req.body.email }).exec((error, user) => {
      if (user)
        return res.status(400).json({ error: "Admin already registerd" });
      Admin.estimatedDocumentCount(async (error, count) => {
        if (error) return res.status(400).json({ error });
        let role = "admin";
        if (count === 0) {
          role = "super-admin";
        }
        const { firstName, lastName, email, password } = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const _admin = new Admin({
          firstName,
          lastName,
          email,
          hash_password,
          role,
        });
        _admin.save((error, data) => {
          if (error) {
            return res.status(400).json({ error: error });
          }

          if (data) {
            return res.status(201).json({
              message: "Admin Created Successfully!",
            });
          }
        });
      });
    });
  } catch (error) {
    return res.status(400).json({ error: "Error connected" });
  }
};

// dangnhap
exports.signin = (req, res) => {
  try {
    Admin.findOne({ email: req.body.email }).exec(async (error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        const isPassword = await user.authenticate(req.body.password);
        if (isPassword) {
          const token = jwt.sign(
            {
              _id: user._id,
              role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          const { _id, firstName, lastName, email, fullName, role } = user;
          res.cookie("token", token, { expiresIn: "1d" });
          return res.status(200).json({
            token,
            user: { _id, firstName, lastName, email, fullName, role },
          });
        } else {
          return res
            .status(400)
            .json({ error: "Please provide a valid username and password" });
        }
      } else {
        return res.status(400).json({
          error: "Please provide a valid username and password",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// dangxuat
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully!",
  });
};

//dannh sach admin
exports.getListAdmin = (req, res) => {
  try {
    Admin.find({}).exec((error, admin) => {
      if (error) return res.status(400).json({ error });
      if (admin) {
        const list_admin = listAmin(admin);
        return res.status(200).json({ data: list_admin });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: "Error get list admin" });
  }
};

// deletadmin
exports.deleteAdminById = (req, res) => {
  try {
    // console.log(req.body)
    const { id } = req.body;
  
    if (id) {
      Admin.deleteOne({ _id: id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          return res
            .status(202)
            .json({ message: "Delete Successfully", result });
        }
      });
    } else {
      return res.status(400).json({ error: "Not ID admin" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No connected" });
  }
};

exports.changeInformation = async (req, res) => {
  try {
    const { id, firstName, lastName } = req.body.data;
    if (id) {
      const updateAdmin = await Admin.findOneAndUpdate(
        { _id: id },
        { firstName: firstName, lastName: lastName },
        { new: true }
      );
      const { _id, email, role } = updateAdmin;
      const user = {
        _id,
        email,
        firstName,
        lastName,
        role,
        fullName: firstName + " " + lastName,
      };
      return res
        .status(201)
        .json({ message: "Update Information Success", user: user });
    } else {
      return res.status(400).json({ error: "No ID" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No Connected" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id, password } = req.body.data;
    if (id) {
      const hash_password = await bcrypt.hash(password, 10);
      const updateAdmin = await Admin.findOneAndUpdate(
        { _id: id },
        { hash_password: hash_password },
        { new: true }
      );
      return res.status(201).json({ message: "Update Passsword Success" });
    } else {
      return res.status(400).json({ error: "No ID" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No connected" });
  }
};


