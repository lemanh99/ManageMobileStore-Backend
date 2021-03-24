const express = require("express");

const router = express.Router();

const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { requireSignin } = require("../../common-middleware");
const {
  createProduct,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  updateProduct,
} = require("../../controllers/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(path.dirname(__dirname)), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/product/all", getProducts);
router.post(
  "/product/create",
  requireSignin,
  upload.array("productPicture"),
  createProduct
);
// router.get("/products/:slug", getProductsBySlug);
router.get("/product/detail/:id", getProductDetailsById);
router.delete("/product/delete/:id", requireSignin, deleteProductById);
router.post(
  "/product/update/:id",
  requireSignin,
  upload.array("productPicture"),
  updateProduct
);
// router.post("/product/getProducts", requireSignin, getProducts);

module.exports = router;
