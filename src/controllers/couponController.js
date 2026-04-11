const Coupon = require('../models/Coupon');

// @desc    Create a new coupon (ADMIN ONLY)
// @route   POST /api/coupons
const createCoupon = async (req, res) => {
    try {
        const { code, discountAmount, minPurchase, expiryDate, usageLimit } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountAmount,
            minPurchase,
            expiryDate,
            usageLimit
        });

        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate a coupon code (USER)
// @route   POST /api/coupons/validate
const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid or inactive coupon code" });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: "This coupon has expired" });
        }

        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({ message: `Minimum purchase of $${coupon.minPurchase} required` });
        }

        res.status(200).json({
            message: "Coupon applied!",
            discount: coupon.discountAmount,
            newTotal: cartTotal - coupon.discountAmount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @route   GET /api/coupons/active
const getActiveCoupons = async (req, res) => {
    try {
        const currentDate = new Date();
        // Find coupons that are Active AND the Expiry Date is in the future
        const coupons = await Coupon.find({ 
            isActive: true, 
            expiryDate: { $gt: currentDate } 
        }).select('code discountAmount minPurchase description expiryDate'); // Don't show usedCount to users

        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRITICAL: Export both functions
module.exports = { createCoupon, validateCoupon,getActiveCoupons };