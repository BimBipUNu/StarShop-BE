const userService = require('../services/userService');
const { validationResult } = require('express-validator');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const updatedUser = await userService.updateUser(
      req.params.id,
      req.body,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: updatedUser
    });
  } catch (error) {
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.userRole);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
