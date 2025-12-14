// backend/services/cartService.js
const db = require('../models');

// Helper lấy giỏ hàng đầy đủ kèm thông tin sản phẩm
exports.getCartByUserId = async (userId) => {
  return db.Cart.findOne({
    where: { userId },
    include: [{
      model: db.CartItem,
      include: [db.Product] // Include Product để frontend có tên, ảnh, giá...
    }],
    order: [[db.CartItem, 'createdAt', 'DESC']] // Sắp xếp sản phẩm mới thêm lên đầu
  });
};

exports.addItem = async (userId, productId, quantity) => {
  // 1. Ép kiểu số để tránh lỗi cộng chuỗi (Quan trọng)
  const qty = Number(quantity);

  // 2. Tìm giỏ hàng, nếu chưa có thì tạo mới
  let cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await db.Cart.create({ userId });
  }

  // 3. Kiểm tra sản phẩm
  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  // 4. Kiểm tra xem sản phẩm đã có trong giỏ chưa
  let cartItem = await db.CartItem.findOne({
    where: {
      cartId: cart.id,
      productId: productId
    }
  });

  if (cartItem) {
    // --- TRƯỜNG HỢP A: ĐÃ CÓ -> CỘNG DỒN SỐ LƯỢNG ---
    const newQuantity = cartItem.quantity + qty;

    // Kiểm tra tồn kho
    if (newQuantity > product.stock) {
      throw new Error(`Kho chỉ còn ${product.stock} sản phẩm. Bạn đã có ${cartItem.quantity} trong giỏ.`);
    }

    cartItem.quantity = newQuantity;
    cartItem.total = newQuantity * product.price; // Cập nhật lại tổng tiền item
    await cartItem.save();

  } else {
    // --- TRƯỜNG HỢP B: CHƯA CÓ -> TẠO MỚI ---

    // Kiểm tra tồn kho
    if (qty > product.stock) {
      throw new Error(`Kho chỉ còn ${product.stock} sản phẩm.`);
    }

    await db.CartItem.create({
      cartId: cart.id,
      productId: productId,
      quantity: qty,
      total: qty * product.price,
    });
  }

  // 5. Trả về toàn bộ giỏ hàng mới nhất để Frontend đồng bộ
  return this.getCartByUserId(userId);
};

// ... Các hàm khác (removeItem, clearCart...) giữ nguyên như bạn đã có
exports.removeItem = async (userId, productId) => {
    const cart = await db.Cart.findOne({ where: { userId } });
    if (cart) {
        await db.CartItem.destroy({ where: { cartId: cart.id, productId } });
    }
};

exports.clearCart = async (userId) => {
    const cart = await db.Cart.findOne({ where: { userId } });
    if (cart) {
        await db.CartItem.destroy({ where: { cartId: cart.id } });
    }
};

exports.updateItemQuantity = async (userId, productId, quantity) => {
    // Logic update giữ nguyên như file cũ của bạn
    // ...
    // Nhớ return this.getCartByUserId(userId); ở cuối
    const cart = await db.Cart.findOne({ where: { userId } });
    const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
    const product = await db.Product.findByPk(productId);

    cartItem.quantity = Number(quantity);
    cartItem.total = Number(quantity) * product.price;
    await cartItem.save();
    return this.getCartByUserId(userId);
};
