const db = require('../models');
const { sequelize } = db;
const { Op } = require('sequelize');

const getTotalRevenue = async () => {
  const result = await db.Order.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue']
    ],
    where: {
      status: 'approved',
    },
    raw: true,
  });
  return result[0].totalRevenue || 0;
};

const getMonthlyRevenue = async () => {
  const result = await db.Order.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
      [sequelize.fn('SUM', sequelize.col('totalAmount')), 'monthlyRevenue']
    ],
    where: {
      status: 'approved',
    },
    group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
    order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
    raw: true,
  });
  return result;
};

const getTopSellingProducts = async (limit = 5) => {
  const result = await db.OrderItem.findAll({
    attributes: [
      'productId',
      [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']
    ],
    include: [{
      model: db.Product,
      attributes: ['name', 'category', 'price']
    }],
    group: ['productId', 'Product.id', 'Product.name', 'Product.category', 'Product.price'],
    order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
    limit,
    raw: true,
  });
  return result;
};

module.exports = { getTotalRevenue, getMonthlyRevenue, getTopSellingProducts };
