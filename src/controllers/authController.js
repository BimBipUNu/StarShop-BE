const authService = require('../services/authService');
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, password } = req.body;
  try {
    const user = await authService.register(name, email, password);
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;
  try {
    const { user, token } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
