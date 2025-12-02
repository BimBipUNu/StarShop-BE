const productService = require('../services/productService');
const { validationResult } = require('express-validator');

const createProduct = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async(req, res, next) => {
    try {
        const products = await productService.getAllProducts(req.query);
        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async(req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully!',
            data: updatedProduct
        });
    } catch (error) {
        if (error.message.includes('Product not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

const deleteProduct = async(req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error.message.includes('Product not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };