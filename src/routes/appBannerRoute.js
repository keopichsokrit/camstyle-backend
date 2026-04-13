const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBanner, getBanners } = require('../controllers/appBannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Setup storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// The order here is CRITICAL
router.post('/', protect, admin, upload.single('image'), createBanner);
router.get('/', getBanners);

module.exports = router;