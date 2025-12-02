const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  return users;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  return user;
};

const updateUser = async (id, userData, requestingUserId, requestingUserRole) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found.');
  }

  if (requestingUserRole !== 'admin' && requestingUserId !== user.id) {
    throw new Error('Forbidden: You can only update your own profile.');
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  await user.update(userData);
  // Exclude password from the returned user object
  const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  return updatedUser;
};

const deleteUser = async (id, requestingUserRole) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found.');
  }

  if (requestingUserRole !== 'admin') {
    throw new Error('Forbidden: Only admins can delete users.');
  }

  await user.destroy();
  return { message: 'User deleted successfully.' };
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
