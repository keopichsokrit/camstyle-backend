const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon, getActiveCoupons } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Users can see available offers
router.get('/active', protect, getActiveCoupons);

// User checks if a coupon works
router.post('/validate', protect, validateCoupon);

// Admin creates a new coupon
router.post('/', protect, admin, createCoupon);


module.exports = router;