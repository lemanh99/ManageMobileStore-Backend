const express = require("express");
const {
  validateSignupForUserRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth-validators");
const {
  requireSignin,
  adminMiddleware,
  requireSigninCustomer,
} = require("../../common-middleware");
const {
  signup,
  signin,
  getAllCustomer,
  blockCustomer,
  signout,
  changeInformation,
  changePassword,
} = require("../../controllers/customer");
const router = express.Router();

router.get("/customer/all", requireSignin, adminMiddleware, getAllCustomer);
router.post(
  "/signup",
  validateSignupForUserRequest,
  isRequestValidated,
  signup
);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/signout", signout);

router.put(
  "/customer/:id/status",
  requireSignin,
  adminMiddleware,
  blockCustomer
);
router.put(
  "/customer/:id/change-information",
  requireSigninCustomer,
  changeInformation
);
router.put(
  "/customer/:id/change-password",
  requireSigninCustomer,
  changePassword
);

module.exports = router;
