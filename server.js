// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorMiddleware');

// Initialize database connection
connectDB();

const app = express();

// Security and Middleware
app.use(helmet()); // Protects headers
app.use(cors()); // Enables cross-origin requests (crucial for Flutter)
app.use(express.json()); // Parses incoming JSON requests
// server.js

// Add this right after app.use(express.json());
app.get('/test', (req, res) => {
    res.json({ 
        status: "success", 
        message: "CamStyle Backend is officially running!" 
    });
});
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// API Routes 
app.use('/api/auth', require('./src/routes/authRoutes'));
// Future routes to be added:
// app.use('/api/products', require('./src/routes/productRoutes'));
// app.use('/api/cart', require('./src/routes/cartRoutes'));
// app.use('/api/payment', require('./src/routes/paymentRoutes'));

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});