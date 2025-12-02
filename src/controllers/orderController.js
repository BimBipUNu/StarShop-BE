const orderService = require('../services/orderService');
const { validationResult } = require('express-validator');

const createOrder = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { cartItems } = req.body;
    const userId = req.userId;

    try {
        const order = await orderService.createOrder(userId, cartItems);
        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

const getOrders = async(req, res, next) => {
    const userId = req.userId;
    try {
        const orders = await orderService.getOrdersByUserId(userId);
        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

const getAllOrders = async(req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({
            success: true,
            message: 'All orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

const approveOrder = async(req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, 'approved');
        res.status(2200).json({
            success: true,
            message: 'Order approved successfully!',
            data: order
        });
    } catch (error) {
        if (error.message.includes('Order not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

const cancelOrder = async(req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, 'cancelled');
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully!',
            data: order
        });
    } catch (error) {
        if (error.message.includes('Order not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

module.exports = { createOrder, getOrders, getAllOrders, approveOrder, cancelOrder };