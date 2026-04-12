const express = require('express');
const router = express.Router();
const { syncPopularItems, getPopularItems } = require('../controllers/popularController');
const { protect, admin } = require('../middleware/authMiddleware');

// Only admin can trigger the calculation
router.post('/sync', protect, admin, syncPopularItems);

// Everyone can see what is popular
router.get('/', getPopularItems);

module.exports = router;