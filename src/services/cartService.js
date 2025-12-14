const db = require('../models');

// Helper function để lấy giỏ hàng đầy đủ
exports.getCartByUserId = async (userId) => {
  return db.Cart.findOne({
    where: { userId },
    include: [{
      model: db.CartItem,
      include: [db.Product] // Kèm thông tin sản phẩm để hiển thị Frontend
    }]
  });
};

exports.addItem = async (userId, productId, quantity) => {
  // 1. Ép kiểu số lượng để đảm bảo tính toán đúng
  const qty = Number(quantity);

  // 2. Tìm hoặc tạo giỏ hàng cho User
  let cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await db.Cart.create({ userId });
  }

  // 3. Kiểm tra sản phẩm có tồn tại trong kho không
  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // 4. Tìm xem sản phẩm đã có trong giỏ của user này chưa
  let cartItem = await db.CartItem.findOne({
    where: {
      cartId: cart.id,
      productId: productId
    }
  });

  if (cartItem) {
    // --- TRƯỜNG HỢP 1: ĐÃ CÓ TRONG GIỎ -> TĂNG SỐ LƯỢNG ---
    const newQuantity = cartItem.quantity + qty;

    // (Tùy chọn) Kiểm tra tồn kho trước khi update
    if (newQuantity > product.stock) {
        throw new Error(`Kho chỉ còn ${product.stock} sản phẩm.`);
    }

    cartItem.quantity = newQuantity;
    cartItem.total = newQuantity * product.price;
    await cartItem.save();
  } else {
    // --- TRƯỜNG HỢP 2: CHƯA CÓ -> TẠO MỚI ---
    if (qty > product.stock) {
        throw new Error(`Kho chỉ còn ${product.stock} sản phẩm.`);
    }

    await db.CartItem.create({
      cartId: cart.id,
      productId,
      quantity: qty,
      total: qty * product.price,
    });
  }

  // 5. Trả về toàn bộ giỏ hàng mới nhất để Frontend cập nhật Redux
  return this.getCartByUserId(userId);
};

exports.updateItemQuantity = async (userId, productId, quantity) => {
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) throw new Error('Cart not found');

  const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (!cartItem) throw new Error('Cart item not found');

  const product = await db.Product.findByPk(productId);

  // Ép kiểu số
  const newQty = Number(quantity);

  if (newQty > product.stock) {
      throw new Error(`Kho chỉ còn ${product.stock} sản phẩm.`);
  }

  cartItem.quantity = newQty;
  cartItem.total = newQty * product.price;
  await cartItem.save();

  return this.getCartByUserId(userId);
};

exports.removeItem = async (userId, productId) => {
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) throw new Error('Cart not found');

  const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (!cartItem) throw new Error('Cart item not found');

  await cartItem.destroy();
  // Không cần return gì, controller trả về 204
};

exports.clearCart = async (userId) => {
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) throw new Error('Cart not found');

  await db.CartItem.destroy({ where: { cartId: cart.id } });
};
