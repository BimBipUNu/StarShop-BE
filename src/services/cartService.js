const db = require('../models');

exports.getCartByUserId = async (userId) => {
  return db.Cart.findOne({
    where: { userId },
    include: [{
      model: db.CartItem,
      include: [db.Product]
    }]
  });
};

exports.addItem = async (userId, productId, quantity) => {
  let cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await db.Cart.create({ userId });
  }

  let cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  const product = await db.Product.findByPk(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (cartItem) {
    cartItem.quantity += quantity;
    cartItem.total = cartItem.quantity * product.price;
    await cartItem.save();
  } else {
    cartItem = await db.CartItem.create({
      cartId: cart.id,
      productId,
      quantity,
      total: quantity * product.price,
    });
  }
  return this.getCartByUserId(userId); // Return updated cart with items
};

exports.updateItemQuantity = async (userId, productId, quantity) => {
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  cartItem.quantity = quantity;
  cartItem.total = quantity * product.price;
  await cartItem.save();
  return this.getCartByUserId(userId); // Return updated cart with items
};

exports.removeItem = async (userId, productId) => {
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  await cartItem.destroy();
};

exports.clearCart = async (userId) => {
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) {
    throw new Error('Cart not found');
  }

  await db.CartItem.destroy({ where: { cartId: cart.id } });
};
