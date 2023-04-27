const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  try {
    let category = new Category(req.body);
    category = await category.save();
    return res.status(200).send({ category_create: category });
  } catch (error) {
    throw new Error(err);
  }
};

const listCategories = async (req, res) => {
  try {
    let categories = await Category.find();
    return res.status(200).send({ categories });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { createCategory, listCategories };
