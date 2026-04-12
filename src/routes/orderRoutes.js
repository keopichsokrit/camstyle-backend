const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get logged-in user's order history
// @route   GET /api/orders/my-history
// @access  Private
router.get('/my-history', protect, async (req, res) => {
    try {
        // Find orders belonging to the user, sorted by newest first
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order history", error: error.message });
    }
});

module.exports = router;