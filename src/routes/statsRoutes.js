const express = require('express');
const statsController = require('../controllers/statsController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

// Get total revenue (Admin only)
router.get(
  '/revenue',
  [verifyToken, authorizeRoles(['admin'])],
  statsController.getTotalRevenue
);

// Get monthly revenue (Admin only)
router.get(
  '/revenue/monthly',
  [verifyToken, authorizeRoles(['admin'])],
  statsController.getMonthlyRevenue
);

// Get top-selling products (Admin only)
router.get(
  '/products/top-selling',
  [verifyToken, authorizeRoles(['admin'])],
  statsController.getTopSellingProducts
);

module.exports = router;
