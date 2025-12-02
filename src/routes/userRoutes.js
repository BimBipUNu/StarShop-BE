const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

// Get all users (Admin only)
router.get(
  '/',
  [verifyToken, authorizeRoles(['admin'])],
  userController.getAllUsers
);

// Get user by ID
router.get(
  '/:id',
  verifyToken,
  userController.getUserById
);

// Update user by ID
router.put(
  '/:id',
  [
    verifyToken,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('password', 'Please enter a password with 6 or more characters').optional().isLength({ min: 6 }),
    check('phone', 'Phone must be a valid number').optional().isString(),
    check('address', 'Address is required').optional().not().isEmpty(),
  ],
  userController.updateUser
);

// Delete user by ID (Admin only)
router.delete(
  '/:id',
  [verifyToken, authorizeRoles(['admin'])],
  userController.deleteUser
);

module.exports = router;
