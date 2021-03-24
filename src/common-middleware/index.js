const jwt = require("jsonwebtoken");

//Admin
exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.headers.authorization;
    try {
      const admin = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = admin;
    } catch (error) {
      return res.status(400).json({ error: "Outdated Token" });
    }
  } else {
    return res.status(400).json({ error: "Authentication required" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
    if(req.admin.role!=="admin"){
        if(req.admin.role!=="super-admin"){
            return res.status(403).json({ error: "Admin access denied"})
        }
    }
    next();
}

exports.superAdminMiddleware = (req, res, next) => {
    if(req.admin.role!=="super-admin"){
        return res.status(400).json({ error: "Super Admin access denied"})
    }
    next();
}

//Customers
exports.requireSigninCustomer = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    // const token = req.headers.authorization.split(" ")[1];
    try {
      const customer = jwt.verify(token, process.env.JWT_SECRET);
      req.customer = customer;
    } catch (error) {
      return res.status(400).json({ error: "Outdated Token" });
    }
  } else {
    return res.status(400).json({ error: "Authentication required" });
  }

  next();
};