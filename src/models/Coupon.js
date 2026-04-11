const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // e.g., "CAMSTYLE10"
    discountAmount: { type: Number, required: true }, // Fixed amount like $5 or percentage
    minPurchase: { type: Number, default: 0 }, // Must buy at least $X to use
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 100 }, // How many people can use it
    usedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);