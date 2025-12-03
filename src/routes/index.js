const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const statsRoutes = require('./statsRoutes');

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Users
 * description: Quản lý người dùng
 */

/**
 * @swagger
 * /users:
 * get:
 * summary: Lấy danh sách tất cả người dùng
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Thành công
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * name:
 * type: string
 * email:
 * type: string
 * 401:
 * description: Chưa đăng nhập
 */

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
