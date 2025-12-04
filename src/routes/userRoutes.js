/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get all users (Admin only)
router.get(
    '/', [verifyToken, authorizeRoles(['admin'])],
    userController.getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
// Get user by ID
router.get(
    '/:id',
    verifyToken,
    userController.getUserById
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
// Update user by ID
router.put(
    '/:id', [
        verifyToken,
        check('name', 'Name is required').optional().not().isEmpty(),
        check('email', 'Please include a valid email').optional().isEmail(),
        check('password', 'Please enter a password with 6 or more characters').optional().isLength({ min: 6 }),
        check('phone', 'Phone must be a valid number').optional().isString(),
        check('address', 'Address is required').optional().not().isEmpty(),
    ],
    userController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
// Delete user by ID (Admin only)
router.delete(
    '/:id', [verifyToken, authorizeRoles(['admin'])],
    userController.deleteUser
);

module.exports = router;
