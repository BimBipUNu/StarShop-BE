require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/models');
const setupRoutes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Setup routes
app.use('/api', setupRoutes);

// Global Error Handler
app.use(errorHandler);

// Database synchronization (optional, for development/testing)
// In production, use migrations
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized successfully.');
        // Initial data seeding can be done here or via sequelize-cli
        // require('../seeders/initial-data'); // example, not recommended for production
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});