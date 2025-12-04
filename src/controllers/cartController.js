const cartService = require('../services/cartService');

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUserId(req.user.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addItem(req.user.id, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateItemQuantity(req.user.id, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await cartService.removeItem(req.user.id, productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
