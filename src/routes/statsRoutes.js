/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Administrator statistics and reports
 */

const express = require('express');
const statsController = require('../controllers/statsController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /stats/revenue:
 *   get:
 *     summary: Get total revenue from approved orders (Admin only)
 *     tags: [Stats]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: Total revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get total revenue (Admin only)
router.get(
    '/revenue', [verifyToken, authorizeRoles(['admin'])],
    statsController.getTotalRevenue
);

/**
 * @swagger
 * /stats/revenue/monthly:
 *   get:
 *     summary: Get monthly revenue from approved orders (Admin only)
 *     tags: [Stats]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: Monthly revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   revenue:
 *                     type: number
 *                     format: float
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get monthly revenue (Admin only)
router.get(
    '/revenue/monthly', [verifyToken, authorizeRoles(['admin'])],
    statsController.getMonthlyRevenue
);

/**
 * @swagger
 * /stats/products/top-selling:
 *   get:
 *     summary: Get top-selling products (Admin only)
 *     tags: [Stats]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top-selling products to retrieve
 *     responses:
 *       200:
 *         description: List of top-selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get top-selling products (Admin only)
router.get(
    '/products/top-selling', [verifyToken, authorizeRoles(['admin'])],
    statsController.getTopSellingProducts
);

module.exports = router;
