const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBrand, getBrands } = require('../controllers/brandController');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin only for creation, public for viewing
router.post('/', protect, admin, upload.single('image'), createBrand);
router.get('/', getBrands);

module.exports = router;