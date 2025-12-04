const db = require('../models');

exports.getAllCategories = async () => {
  return db.Category.findAll();
};

exports.getCategoryById = async (id) => {
  return db.Category.findByPk(id);
};

exports.createCategory = async (categoryData) => {
  return db.Category.create(categoryData);
};

exports.updateCategory = async (id, categoryData) => {
  const category = await db.Category.findByPk(id);
  if (!category) {
    return null;
  }
  await category.update(categoryData);
  return category;
};

exports.deleteCategory = async (id) => {
  const category = await db.Category.findByPk(id);
  if (!category) {
    return null;
  }
  await category.destroy();
  return true;
};
