const express = require('express');
const { check } = require('express-validator');
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authJwt');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: User's cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.get('/', verifyToken, cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - xAccessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post(
  '/',
  [verifyToken, [check('productId', 'Product ID is required').isInt(), check('quantity', 'Quantity is required').isInt({ gt: 0 })]],
  cartController.addItemToCart
);

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to update in cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product or cart item not found
 */
router.put(
  '/:productId',
  [verifyToken, check('quantity', 'Quantity is required').isInt({ gt: 0 })],
  cartController.updateCartItemQuantity
);

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to remove from cart
 *     responses:
 *       204:
 *         description: Product removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product or cart item not found
 */
router.delete('/:productId', verifyToken, cartController.removeCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       204:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
