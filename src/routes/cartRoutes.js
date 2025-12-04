const express = require('express');
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authJwt');

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Cart
 * description: Quản lý giỏ hàng
 */

/**
 * @swagger
 * /cart:
 * get:
 * summary: Xem giỏ hàng của tôi
 * tags: [Cart]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Thông tin giỏ hàng và các sản phẩm
 */
router.get('/', verifyToken, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 * post:
 * summary: Thêm sản phẩm vào giỏ
 * tags: [Cart]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - productId
 * - quantity
 * properties:
 * productId:
 * type: integer
 * quantity:
 * type: integer
 * example: 1
 * responses:
 * 200:
 * description: Thêm thành công
 */
router.post('/add', verifyToken, cartController.addToCart);

/**
 * @swagger
 * /cart/item/{id}:
 * put:
 * summary: Cập nhật số lượng sản phẩm trong giỏ
 * tags: [Cart]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID của CartItem (không phải ProductId)
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * quantity:
 * type: integer
 * responses:
 * 200:
 * description: Cập nhật thành công
 */
router.put('/item/:id', verifyToken, cartController.updateCartItem);

/**
 * @swagger
 * /cart/item/{id}:
 * delete:
 * summary: Xóa 1 sản phẩm khỏi giỏ
 * tags: [Cart]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Đã xóa sản phẩm
 */
router.delete('/item/:id', verifyToken, cartController.removeCartItem);

/**
 * @swagger
 * /cart/clear:
 * delete:
 * summary: Xóa sạch giỏ hàng
 * tags: [Cart]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Giỏ hàng đã được làm trống
 */
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
