const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const statsRoutes = require('./statsRoutes');
const cartRoutes = require('./cartRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/stats', statsRoutes);
router.use('/cart', cartRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
