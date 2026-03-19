const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/checkout", protect, paymentController.generateBakongQR);
router.post("/verify", protect, paymentController.verifyPayment);

module.exports = router;