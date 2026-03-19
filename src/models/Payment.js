// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
//     cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
//     amount: Number,
//     method: { type: String, default: "BAKONG_KHQR" },
//     status: { 
//         type: String, 
//         enum: ['PENDING', 'SUCCESS', 'FAILED'], 
//         default: 'PENDING' 
//     },
//     md5: String,
//     qrString: String,
//     qrGeneratedAt: Date
// }, { timestamps: true });

// module.exports = mongoose.model('Payment', paymentSchema);

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Snapshot of cart items at time of payment (so cart can be cleared)
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'KHR'],
        default: 'USD'
    },
    // Bakong KHQR data
    qrCode: {
        type: String,   // Raw KHQR string
        required: true
    },
    md5: {
        type: String,   // MD5 hash — used to poll payment status
        required: true,
        unique: true
    },
    deeplink: {
        type: String    // Bakong deeplink (optional, for mobile redirect)
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'EXPIRED', 'FAILED'],
        default: 'PENDING'
    },
    expiresAt: {
        type: Date,
        required: true  // QR codes expire — track this
    },
    paidAt: {
        type: Date      // Set when payment confirmed
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);