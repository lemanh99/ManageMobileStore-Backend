const express = require("express");
const {
  validateSignupForUserRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth-validators");
const { requireSignin, adminMiddleware } = require("../../common-middleware");
const {
  signup,
  signin,
  getAllCustomer,
  blockCustomer,
  signout,
} = require("../../controllers/customer");
const router = express.Router();

router.post(
  "/signup",
  validateSignupForUserRequest,
  isRequestValidated,
  signup
);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/signout", signout);
router.get("/customer/all", requireSignin, adminMiddleware, getAllCustomer);
router.put("/customer/:id/status", requireSignin, adminMiddleware, blockCustomer);

module.exports = router;
