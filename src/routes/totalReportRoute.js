const express = require('express');
const router = express.Router();
const { generateTotalReport } = require('../controllers/totalReportController');
const { protect } = require('../middleware/authMiddleware');

// Get spending report
router.get('/spending', protect, generateTotalReport);

module.exports = router;