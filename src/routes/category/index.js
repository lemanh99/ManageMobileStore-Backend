const express = require("express");

const router = express.Router();

const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { requireSignin } = require("../../common-middleware");
const {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(path.dirname(__dirname)), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/category/all", getCategories);
router.post(
  "/category/create",
  requireSignin,
  upload.single("categoryImage"),
  addCategory
);
router.delete("/category/delete", requireSignin, deleteCategory);
router.post(
  "/category/update",
  requireSignin,
  upload.single("categoryImage"),
  updateCategory
);

module.exports = router;
