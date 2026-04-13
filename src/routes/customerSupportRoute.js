const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages } = require('../controllers/customerSupportController');
const { protect, admin } = require('../middleware/authMiddleware');

// Users can send messages
router.post('/', protect, sendMessage);

// Only Admin can see the support inbox
router.get('/', protect, admin, getAllMessages);

module.exports = router;