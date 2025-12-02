const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

// Create a new order (User only)
router.post(
  '/',
  [verifyToken,
    check('cartItems', 'cartItems are required and must be an array').isArray(),
    check('cartItems.*.productId', 'productId is required and must be an integer').isInt({ gt: 0 }),
    check('cartItems.*.quantity', 'quantity is required and must be an integer greater than 0').isInt({ gt: 0 }),
  ],
  orderController.createOrder
);

// Get orders for the current user (User, Staff, Admin)
router.get(
  '/',
  verifyToken,
  orderController.getOrders
);

// Get all orders (Admin only)
router.get(
  '/all',
  [verifyToken, authorizeRoles(['admin'])],
  orderController.getAllOrders
);

// Approve an order (Admin and Staff only)
router.put(
  '/:id/approve',
  [verifyToken, authorizeRoles(['admin', 'staff'])],
  orderController.approveOrder
);

// Cancel an order (Admin and Staff only)
router.put(
  '/:id/cancel',
  [verifyToken, authorizeRoles(['admin', 'staff'])],
  orderController.cancelOrder
);

module.exports = router;
