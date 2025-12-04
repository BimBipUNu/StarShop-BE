/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (User only)
 *     tags: [Orders]
 *     security:
 *       - xAccessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItems
 *             properties:
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *             example:
 *               cartItems:
 *                 - productId: 1
 *                   quantity: 2
 *                 - productId: 3
 *                   quantity: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
// Create a new order (User only)
router.post(
    '/', [verifyToken,
        check('cartItems', 'cartItems are required and must be an array').isArray(),
        check('cartItems.*.productId', 'productId is required and must be an integer').isInt({ gt: 0 }),
        check('cartItems.*.quantity', 'quantity is required and must be an integer greater than 0').isInt({ gt: 0 }),
    ],
    orderController.createOrder
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders for the current user (User, Staff, Admin)
 *     tags: [Orders]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: A list of orders for the authenticated user
 *       401:
 *         description: Unauthorized
 */
// Get orders for the current user (User, Staff, Admin)
router.get(
    '/',
    verifyToken,
    orderController.getOrders
);

/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: A list of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get all orders (Admin only)
router.get(
    '/all', [verifyToken, authorizeRoles(['admin'])],
    orderController.getAllOrders
);

/**
 * @swagger
 * /orders/{id}/approve:
 *   put:
 *     summary: Approve an order (Admin and Staff only)
 *     tags: [Orders]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to approve
 *     responses:
 *       200:
 *         description: Order approved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
// Approve an order (Admin and Staff only)
router.put(
    '/:id/approve', [verifyToken, authorizeRoles(['admin', 'staff'])],
    orderController.approveOrder
);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order (Admin and Staff only)
 *     tags: [Orders]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
// Cancel an order (Admin and Staff only)
router.put(
    '/:id/cancel', [verifyToken, authorizeRoles(['admin', 'staff'])],
    orderController.cancelOrder
);

module.exports = router;
