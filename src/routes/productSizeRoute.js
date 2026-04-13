const express = require('express');
const router = express.Router();
const { createSize, getSizes } = require('../controllers/productSizeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Anyone can see sizes to filter or choose
router.get('/', getSizes);

// Only you (Admin) can add new size options
router.post('/', protect, admin, createSize);

module.exports = router;