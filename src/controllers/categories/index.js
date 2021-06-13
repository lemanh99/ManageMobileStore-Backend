const slugify = require("slugify");
const shortid = require("shortid");
const Category = require("../../models/category");

function createCategories(categories) {
  const categoryList = [];
  for (let cate of categories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      categoryImage: cate.categoryImage,
    });
  }
  return categoryList;
}

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.admin._id,
  };
  if (req.file) {
    categoryObj.categoryImage = req.file.filename;
  }
  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res
        .status(201)
        .json({ category, message: "Add category success" });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error)
      return res.status(400).json({ success: false, statusCode: 400, error });
    if (categories) {
      const categoryList = createCategories(categories);
      res
        .status(200)
        .json({ success: true, statusCode: 200, data: categoryList });
    }
  });
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      Category.deleteOne({ _id: id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          return res
            .status(202)
            .json({ message: "Delete Successfully", result });
        }
      });
    } else {
      return res.status(400).json({ error: "Not ID Category" });
    }
  } catch (error) {
    return res.status(400).json({ error: "No connected" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = {
    name: req.body.name,
    slug: req.body.name
      ? `${slugify(req.body.name)}-${shortid.generate()}`
      : null,
  };
  if (req.file) {
    category.categoryImage = req.file.filename;
  }
  if (id) {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id },
      category,
      {
        new: true,
      }
    );
    return res.status(201).json({ updatedCategory });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};
