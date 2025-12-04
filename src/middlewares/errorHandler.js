const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = [];

    // Handle Mongoose validation errors or other custom validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        // Assuming err.errors is an object for Mongoose, convert to array
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.message);
        }
    }

    // Handle errors from express-validator (if they are passed as part of err)
    // A more robust way might be to catch validation errors in controllers and pass a custom error
    if (err.array) { // Check if it's an express-validator error structure
        statusCode = 400;
        message = 'Validation failed';
        errors = err.array().map(error => ({ field: error.param, message: error.msg }));
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(errors.length > 0 && { errors: errors }), // Only include errors if there are any
    });
};

module.exports = errorHandler;
