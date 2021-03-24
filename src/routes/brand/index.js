const express = require("express");

const router = express.Router();

const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { requireSignin } = require("../../common-middleware");
const { getBrands, addBrand, deleteBrand, updateBrand } = require("../../controllers/brand");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(path.dirname(__dirname)), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/brand/all", getBrands);
router.post(
  "/brand/create",
  requireSignin,
  upload.single("brandImage"),
  addBrand
);
router.delete("/brand/delete/:id", requireSignin, deleteBrand);
router.post(
  "/brand/update/:id",
  requireSignin,
  upload.single("brandImage"),
  updateBrand
);

module.exports = router;
