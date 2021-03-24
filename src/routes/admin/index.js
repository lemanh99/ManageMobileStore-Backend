const express = require("express");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth-validators");
const {
  requireSignin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../../common-middleware");
const {
  signup,
  signin,
  getListAdmin,
  signout,
  deleteAdminById,
  changeInformation,
  changePassword,
} = require("../../controllers/admin");

const router = express.Router();

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/admin/signout", signout);

router.get("/admin/all", requireSignin, adminMiddleware, getListAdmin);
router.delete(
  "/admin/delete/:id",
  requireSignin,
  superAdminMiddleware,
  deleteAdminById
);
router.put(
  "/admin/:id/change-information",
  requireSignin,
  adminMiddleware,
  changeInformation
);
router.put(
  "/admin/:id/change-password",
  requireSignin,
  adminMiddleware,
  changePassword
);
module.exports = router;
