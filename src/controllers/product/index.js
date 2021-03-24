const Product = require("../../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
// const Category = require("../models/category");

function createProducts(products) {
  const productList = [];
  for (let product of products) {
    productList.push({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount: product.discount,
      quantity: product.quantity,
      description: product.description,
      reviewers: product.reviewers,
      brandId: product.brandId,
      productPictures: product.productPictures,
    });
  }
  return productList;
}

exports.getProducts = (req, res) => {
  Product.find({}).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products) {
      const productList = createProducts(products);
      res.status(200).json({ data: productList });
    }
  });
};

exports.createProduct = (req, res) => {
  const { name, price, description, brandId, quantity, discount } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    discount,
    description,
    productPictures,
    brandId,
    createdBy: req.admin._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product, files: req.files });
    }
  });
};

// exports.getProductsBySlug = (req, res) => {
//   const { slug } = req.params;
//   Category.findOne({ slug: slug })
//     .select("_id type")
//     .exec((error, category) => {
//       if (error) {
//         return res.status(400).json({ error });
//       }

//       if (category) {
//         Product.find({ category: category._id }).exec((error, products) => {
//           if (error) {
//             return res.status(400).json({ error });
//           }
//           res.status(200).json({ products });
//         });
//       }
//     });
// };

exports.getProductDetailsById = (req, res) => {
  const { id } = req.params;
  if (id) {
    Product.findOne({ _id: id }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = {};
  if (req.body.name) {
    product.name = req.body.name;
    product.slug = slugify(req.body.name);
  }
  if (req.body.price) product.price = req.body.price;
  if (req.body.quantity) product.quantity = req.body.quantity;
  if (req.body.discount) product.discount = req.body.discount;
  if (req.body.description) product.description = req.body.description;
  if (req.body.brandId) product.brandId = req.body.brandId;
  if (req.files.length > 0) {
    product.productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  if (id) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      product,
      {
        new: true,
      }
    );
    return res.status(201).json({ updatedProduct });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};

exports.deleteProductById = (req, res) => {
  const { id } = req.params;
  if (id) {
    Product.deleteOne({ _id: id }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

// exports.getProducts = async (req, res) => {
//   const products = await Product.find({ createdBy: req.user._id })
//     .select("_id name price quantity slug description productPictures brandId")
//     .populate({ path: "brand", select: "_id name" })
//     .exec();

//   res.status(200).json({ products });
// };
