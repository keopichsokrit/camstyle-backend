const express = require('express');
const router = express.Router();
const { createColor, getColors } = require('../controllers/productColorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getColors);
router.post('/', protect, admin, createColor);

module.exports = router;