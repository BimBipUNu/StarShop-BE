const statsService = require('../services/statsService');

const getTotalRevenue = async (req, res, next) => {
  try {
    const totalRevenue = await statsService.getTotalRevenue();
    res.status(200).json({
      success: true,
      message: 'Total revenue retrieved successfully',
      data: { totalRevenue }
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyRevenue = async (req, res, next) => {
  try {
    const monthlyRevenue = await statsService.getMonthlyRevenue();
    res.status(200).json({
      success: true,
      message: 'Monthly revenue retrieved successfully',
      data: monthlyRevenue
    });
  } catch (error) {
    next(error);
  }
};

const getTopSellingProducts = async (req, res, next) => {
  try {
    const topSellingProducts = await statsService.getTopSellingProducts(req.query.limit);
    res.status(200).json({
      success: true,
      message: 'Top selling products retrieved successfully',
      data: topSellingProducts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTotalRevenue, getMonthlyRevenue, getTopSellingProducts };
