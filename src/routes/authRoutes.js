// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser , getUserProfile, forgotPassword, 
    resetPassword} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import the guard

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// This is a GET request protected by JWT
router.get('/profile', protect, getUserProfile);

module.exports = router;