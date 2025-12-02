const db = require('../models');
const Product = db.Product;
const { Op } = require('sequelize');

const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

const getAllProducts = async (filters) => {
  const where = {};
  if (filters.name) {
    where.name = { [Op.like]: `%${filters.name}%` };
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.minPrice && filters.maxPrice) {
    where.price = { [Op.between]: [filters.minPrice, filters.maxPrice] };
  } else if (filters.minPrice) {
    where.price = { [Op.gte]: filters.minPrice };
  } else if (filters.maxPrice) {
    where.price = { [Op.lte]: filters.maxPrice };
  }

  const products = await Product.findAll({ where });
  return products;
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Product not found.');
  }
  return product;
};

const updateProduct = async (id, productData) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Product not found.');
  }
  await product.update(productData);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Product not found.');
  }
  await product.destroy();
  return { message: 'Product deleted successfully.' };
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
