const Customer = require("../../models/customer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = (req, res) => {
  try {
    Customer.findOne(
      { email: req.body.email } || { username: req.body.username }
    ).exec((error, user) => {
      if (user)
        return res.status(400).json({ error: "User already registerd" });
      Customer.estimatedDocumentCount(async (error, count) => {
        if (error) return res.status(400).json({ error });

        const { firstName, lastName, username, email, password } = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const _customer = new Customer({
          firstName,
          lastName,
          email,
          username,
          hash_password,
        });
        _customer.save((error, data) => {
          if (error) {
            return res.status(400).json({ error: error });
          }

          if (data) {
            return res.status(201).json({
              message: "Customer Created Successfully!",
            });
          }
        });
      });
    });
  } catch (error) {
    return res.status(400).json({ error: "Error connected" });
  }
};

exports.signin = (req, res) => {
  try {
    Customer.findOne(
      { email: req.body.email } || { username: req.body.username }
    ).exec(async (error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        const isPassword = await user.authenticate(req.body.password);
        if (isPassword) {
          if (user.status === "active") {
            const token = jwt.sign(
              {
                _id: user._id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1d" }
            );
            const {
              _id,
              firstName,
              lastName,
              username,
              email,
              fullName,
              address,
              phoneNumber,
            } = user;
            res.cookie("token-user", token, { expiresIn: "1d" });
            return res.status(200).json({
              token,
              user: {
                _id,
                firstName,
                lastName,
                username,
                email,
                phoneNumber,
                address,
                fullName,
              },
            });
          } else {
            return res.status(204).json({
              error: "The account has been locked",
            });
          }
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

exports.signout = (req, res) => {
  res.clearCookie("token-user");
  res.status(200).json({
    message: "Signout successfully!",
  });
};

const listCustomer = (customers) => {
  let list_customer = [];
  for (let customer of customers) {
    list_customer.push({
      _id: customer._id,
      username: customer.username,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: customer.fullName,
      email: customer.email,
      status: customer.status,
      address: customer.address,
      phoneNumber: customer.phoneNumber,
      profilePicture: customer.profilePicture,
      createdAt: customer.createdAt,
    });
  }
  return list_customer;
};

//dannh sach customer
exports.getAllCustomer = (req, res) => {
  try {
    Customer.find({}).exec((error, customers) => {
      if (error) return res.status(400).json({ error });
      if (customers) {
        const list_customer = listCustomer(customers);
        return res.status(200).json({ data: list_customer });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: "Error get list customer" });
  }
};
exports.blockCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const status_block = await Customer.findOneAndUpdate(
        { _id: id, status: "block" },
        { status: "active" },
        { new: true }
      );
      if (!status_block) {
        const status_active = await Customer.findOneAndUpdate(
          { _id: id, status: "active" },
          { status: "block" },
          { new: true }
        );
      }

      return res.status(201).json({ message: "Update Status Success" });
    } else {
      return res.status(400).json({ error: "No ID" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No Connected" });
  }
};

exports.changeInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, address, phoneNumber } = req.body.data;
    if (id) {
      const updateUser = await Customer.findOneAndUpdate(
        { _id: id },
        {
          firstName: firstName,
          lastName: lastName,
          address: address,
          phoneNumber: phoneNumber,
        },
        { new: true }
      );
      console.log(updateUser);
      return res
        .status(201)
        .json({ message: "Update Information Success", user: updateUser });
    } else {
      return res.status(400).json({ error: "No ID" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No Connected" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body.data;
    if (id) {
      const hash_password = await bcrypt.hash(password, 10);
      const updateAdmin = await Customer.findOneAndUpdate(
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
