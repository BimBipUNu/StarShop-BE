const express = require('express');
const categoryController = require('../controllers/categoryController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Categories
 * description: Quản lý danh mục sản phẩm
 */

/**
 * @swagger
 * /categories:
 * get:
 * summary: Lấy tất cả danh mục
 * tags: [Categories]
 * responses:
 * 200:
 * description: Danh sách danh mục
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 * get:
 * summary: Lấy chi tiết danh mục theo ID
 * tags: [Categories]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Thông tin danh mục
 * 404:
 * description: Không tìm thấy
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /categories:
 * post:
 * summary: Tạo danh mục mới (Admin)
 * tags: [Categories]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * properties:
 * name:
 * type: string
 * icon:
 * type: string
 * responses:
 * 201:
 * description: Tạo thành công
 */
router.post(
  '/',
  [verifyToken, authorizeRoles(['admin'])],
  categoryController.createCategory
);

/**
 * @swagger
 * /categories/{id}:
 * put:
 * summary: Cập nhật danh mục (Admin)
 * tags: [Categories]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * icon:
 * type: string
 * responses:
 * 200:
 * description: Cập nhật thành công
 */
router.put(
  '/:id',
  [verifyToken, authorizeRoles(['admin'])],
  categoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 * delete:
 * summary: Xóa danh mục (Admin)
 * tags: [Categories]
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
 * description: Xóa thành công
 */
router.delete(
  '/:id',
  [verifyToken, authorizeRoles(['admin'])],
  categoryController.deleteCategory
);

module.exports = router;
