const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const { sequelize } = db;

const createOrder = async (userId, cartItems) => {
  const transaction = await sequelize.transaction();
  try {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Product ${item.productId} not found or insufficient stock.`);
      }
      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
      await product.update({ stock: product.stock - item.quantity }, { transaction });
    }

    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
    }, { transaction });

    await Promise.all(orderItemsData.map(item => 
      OrderItem.create({ ...item, orderId: order.id }, { transaction })
    ));

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOrdersByUserId = async (userId) => {
  const orders = await Order.findAll({
    where: { userId },
    include: [{
      model: OrderItem,
      include: [Product]
    }],
  });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.findAll({
    include: [{
      model: OrderItem,
      include: [Product]
    }, {
      model: db.User,
      attributes: ['id', 'name', 'email']
    }],
  });
  return orders;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new Error('Order not found.');
  }
  order.status = status;
  await order.save();
  return order;
};

module.exports = { createOrder, getOrdersByUserId, getAllOrders, updateOrderStatus };
