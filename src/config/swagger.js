const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'StarShop API Documentation',
            version: '1.0.0',
            description: 'API documentation for the StarShop e-commerce application',
        },
        servers: [{
            url: 'http://localhost:3000/api',
            description: 'Development server',
        }, ],
        components: {
            securitySchemes: {
                xAccessToken: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-access-token',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['user', 'admin', 'staff'] },
                        phone: { type: 'string' },
                        address: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                UserInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' },
                        phone: { type: 'string' },
                        address: { type: 'string' },
                    },
                    required: ['name', 'email', 'password'],
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                        price: { type: 'number', format: 'float' },
                        stock: { type: 'integer' },
                        imageUrl: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ProductInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                        price: { type: 'number', format: 'float' },
                        stock: { type: 'integer' },
                        imageUrl: { type: 'string' },
                    },
                    required: ['name', 'category', 'price', 'stock'],
                },
                OrderItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        orderId: { type: 'integer', format: 'int32' },
                        productId: { type: 'integer', format: 'int32' },
                        quantity: { type: 'integer' },
                        price: { type: 'number', format: 'float' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        userId: { type: 'integer', format: 'int32' },
                        totalAmount: { type: 'number', format: 'float' },
                        status: { type: 'string', enum: ['pending', 'approved', 'cancelled'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        OrderItems: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/OrderItem',
                            },
                        },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        name: { type: 'string' },
                        icon: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Cart: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        userId: { type: 'integer', format: 'int32' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        CartItems: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/CartItem',
                            },
                        },
                    },
                },
                CartItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int32' },
                        cartId: { type: 'integer', format: 'int32' },
                        productId: { type: 'integer', format: 'int32' },
                        quantity: { type: 'integer' },
                        total: { type: 'number', format: 'float' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [{
            xAccessToken: [],
        }, ],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
