const slugify = require("slugify");
const shortid = require("shortid");
const Brand = require("../../models/brand");

function createBrands(brands) {
  const brandList = [];
  for (let brand of brands) {
    brandList.push({
      _id: brand._id,
      name: brand.name,
      categoryId: brand.categoryId,
      slug: brand.slug,
      brandImage: brand.brandImage,
    });
  }
  return brandList;
}

exports.addBrand = (req, res) => {
  const brandObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    categoryId: req.body.categoryId,
    createdBy: req.admin._id,
  };
  if (req.file) {
    brandObj.brandImage = req.file.filename;
  }
  const br = new Brand(brandObj);
  br.save((error, brand) => {
    if (error) return res.status(400).json({ error });
    if (brand) {
      return res.status(201).json({ brand, message: "Add brand success" });
    }
  });
};

exports.getBrands = (req, res) => {
  Brand.find({}).exec((error, brands) => {
    if (error)
      return res.status(400).json({ success: false, statusCode: 400, error });
    if (brands) {
      const brandList = createBrands(brands);
      res.status(200).json({ success: true, statusCode: 200, data: brandList });
    }
  });
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      Brand.deleteOne({ _id: id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          return res
            .status(202)
            .json({ message: "Delete Successfully", result });
        }
      });
    } else {
      return res.status(400).json({ error: "Not ID Brand" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No connected" });
  }
};

exports.updateBrand = async (req, res) => {
  const id = req.params;
  const brand = {
    name: req.body.name,
    slug: req.body.name
      ? `${slugify(req.body.name)}-${shortid.generate()}`
      : null,
  };
  if (req.file) {
    brand.brandImage = req.file.filename;
  }
  if (req.body.categoryId) {
    brand.categoryId = req.body.categoryId;
  }
  if (id) {
    const updatedBrands = await Brand.findOneAndUpdate({ _id: id }, brand, {
      new: true,
    });
    return res.status(201).json({ updatedBrands });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};
