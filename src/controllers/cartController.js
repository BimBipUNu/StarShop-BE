const db = require('../models');
const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;

// Lấy giỏ hàng của User đang đăng nhập
exports.getCart = async (req, res) => {
  try {
    // Tìm giỏ hàng, nếu chưa có thì tạo mới (findOrCreate)
    let [cart] = await Cart.findOrCreate({
      where: { userId: req.userId },
      defaults: { userId: req.userId }
    });

    // Lấy chi tiết items và thông tin sản phẩm
    const cartDetails = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'] }]
        }
      ]
    });

    res.status(200).json(cartDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1. Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Lấy giỏ hàng của user
    let [cart] = await Cart.findOrCreate({
      where: { userId: req.userId },
      defaults: { userId: req.userId }
    });

    // 3. Kiểm tra sản phẩm đã có trong giỏ chưa
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId: productId }
    });

    if (cartItem) {
      // Nếu có rồi -> Cộng dồn số lượng
      cartItem.quantity += quantity;
      cartItem.total = cartItem.quantity * product.price;
      await cartItem.save();
    } else {
      // Nếu chưa có -> Tạo mới
      await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
        total: quantity * product.price
      });
    }

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng item
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body; // Số lượng mới
    const cartItemId = req.params.id;

    const cartItem = await CartItem.findByPk(cartItemId, {
      include: [Product]
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Cập nhật
    cartItem.quantity = quantity;
    cartItem.total = quantity * cartItem.Product.price;
    await cartItem.save();

    res.status(200).json({ message: "Cart updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa 1 item khỏi giỏ
exports.removeCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await CartItem.destroy({ where: { id: cartItemId } });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sạch giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
