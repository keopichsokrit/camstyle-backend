const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // Use the same upload as products

// Standard PUT route for profile
router.put('/update', protect, upload.single('image'), updateProfile);

// GET user profile data
router.get('/', protect, getProfile);

module.exports = router;