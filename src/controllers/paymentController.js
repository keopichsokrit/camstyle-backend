const { BakongKHQR, MerchantInfo, khqrData } = require('bakong-khqr');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate total (DRY - Don't Repeat Yourself)
const calculateTotal = async (cart) => {
    await cart.populate('items.product', 'price');
    const total = cart.items.reduce((acc, item) => {
        const price = item.product ? item.product.price : 0;
        return acc + (price * item.quantity);
    }, 0);
    return total;
};

// @desc    Generate Bakong KHQR for the current cart
// @route   POST /api/payment/generate-qr
// @access  Private

exports.generateBakongQR = async (req, res) => {
    try {
        // ... (your existing cart lookup logic)

        // Find the cart for the logged-in user (assume req.user._id is available)
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.product',
            select: 'price'
        });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const amount = await calculateTotal(cart); // Amount in dollars for USD

        if (amount <= 0) {
            return res.status(400).json({ message: "Cart total amount must be greater than 0" });
        }

        const optionalData = {
            billNumber: `INV-${Date.now()}`,
            mobileNumber: "85512345678", // Must be 855 format
            storeLabel: "CamStyle Shop",
            terminalLabel: "Mobile App",
            amount: amount, // Amount in dollars for USD
            currency: khqrData.currency.usd, // Set currency to USD
            expirationTimestamp: Date.now() + (5 * 60 * 1000), // Required for dynamic QR (5 minutes)
        };

        // CRITICAL: The constructor order MUST be exactly this:
        const merchantInfo = new MerchantInfo(
            process.env.BAKONG_ACCOUNT_ID,      // 1. Account ID
            process.env.BAKONG_ACCOUNT_NAME,    // 2. Name
            "Phnom Penh",                       // 3. City
            process.env.BAKONG_MERCHANT_ID,     // 4. Merchant ID
            "BKRTKHPP",                         // 5. BIC (Bank Identifier Code for BKRT)
            optionalData                        // 6. Optional Object
        );

        const khqr = new BakongKHQR();
        const response = khqr.generateMerchant(merchantInfo);

        if (!response || !response.data) {
            return res.status(500).json({ 
                message: "Failed to generate QR code", 
                details: response ? response : "No response from QR generator" 
            });
        }

        // Validation Check before sending to Flutter
        const validation = BakongKHQR.verify(response.data.qr);
        
        if (!validation.isValid) {
            return res.status(500).json({ 
                message: "Generated QR is invalid internally",
                details: validation.reason 
            });
        }

        res.status(200).json({
            qrString: response.data.qr,
            md5: response.data.md5,
            totalAmount: amount, // Amount in dollars
            billNumber: optionalData.billNumber
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Payment Status (Polling from Flutter)
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
    const { md5 } = req.body;

    try {
        const khqr = new BakongKHQR();
        // Use your Bakong API Token from the Bakong Developer Portal
        // For production, this token is required to use the 'checkTransaction' method
        const apiToken = process.env.BAKONG_TOKEN; 
        
        // This is a conceptual check. Usually, you poll the Bakong Open API 
        // to see if the MD5 hash has been 'cleared' (paid).
        // If success: clear user's cart in your DB.
        
        res.status(200).json({ 
            message: "Status check initiated", 
            hint: "In a real setup, call Bakong API with MD5 here." 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};