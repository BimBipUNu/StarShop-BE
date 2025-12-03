// const express = require('express');
// const { check } = require('express-validator');
// const orderController = require('../controllers/orderController');
// const { verifyToken } = require('../middlewares/authJwt');
// const authorizeRoles = require('../middlewares/authorizeRoles');

// const router = express.Router();

// // Create a new order (User only)
// router.post(
//   '/',
//   [verifyToken,
//     check('cartItems', 'cartItems are required and must be an array').isArray(),
//     check('cartItems.*.productId', 'productId is required and must be an integer').isInt({ gt: 0 }),
//     check('cartItems.*.quantity', 'quantity is required and must be an integer greater than 0').isInt({ gt: 0 }),
//   ],
//   orderController.createOrder
// );

// // Get orders for the current user (User, Staff, Admin)
// router.get(
//   '/',
//   verifyToken,
//   orderController.getOrders
// );

// // Get all orders (Admin only)
// router.get(
//   '/all',
//   [verifyToken, authorizeRoles(['admin'])],
//   orderController.getAllOrders
// );

// // Approve an order (Admin and Staff only)
// router.put(
//   '/:id/approve',
//   [verifyToken, authorizeRoles(['admin', 'staff'])],
//   orderController.approveOrder
// );

// // Cancel an order (Admin and Staff only)
// router.put(
//   '/:id/cancel',
//   [verifyToken, authorizeRoles(['admin', 'staff'])],
//   orderController.cancelOrder
// );

// module.exports = router;

const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Orders
 * description: Quản lý đơn hàng
 */

/**
 * @swagger
 * /orders:
 * post:
 * summary: Tạo đơn hàng mới (User)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * cartItems:
 * type: array
 * items:
 * type: object
 * properties:
 * productId:
 * type: integer
 * quantity:
 * type: integer
 * example:
 * cartItems:
 * - productId: 1
 * quantity: 2
 * - productId: 3
 * quantity: 1
 * responses:
 * 201:
 * description: Tạo đơn thành công
 * 400:
 * description: Dữ liệu không hợp lệ
 * get:
 * summary: Lấy lịch sử đơn hàng của user đang đăng nhập
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách đơn hàng
 */

// Create a new order (User only)
router.post(
  '/',
  [
    verifyToken,
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

/**
 * @swagger
 * /orders/all:
 * get:
 * summary: Lấy tất cả đơn hàng hệ thống (Admin Only)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Thành công
 * 403:
 * description: Không có quyền truy cập
 */
router.get(
  '/all',
  [verifyToken, authorizeRoles(['admin'])],
  orderController.getAllOrders
);

/**
 * @swagger
 * /orders/{id}/approve:
 * put:
 * summary: Duyệt đơn hàng (Admin/Staff)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID của đơn hàng
 * responses:
 * 200:
 * description: Đã duyệt đơn hàng
 * 404:
 * description: Không tìm thấy đơn hàng
 */
router.put(
  '/:id/approve',
  [verifyToken, authorizeRoles(['admin', 'staff'])],
  orderController.approveOrder
);

/**
 * @swagger
 * /orders/{id}/cancel:
 * put:
 * summary: Hủy đơn hàng (Admin/Staff)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID của đơn hàng
 * responses:
 * 200:
 * description: Đã hủy đơn hàng
 */
router.put(
  '/:id/cancel',
  [verifyToken, authorizeRoles(['admin', 'staff'])],
  orderController.cancelOrder
);

module.exports = router;
