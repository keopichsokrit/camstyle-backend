const { BakongKHQR, MerchantInfo, khqrData } = require('bakong-khqr');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendPaymentSuccessAlert } = require('../services/telegram.service');

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
    const requestMd5 = req.body?.md5 || req.body?.md;

    if (!requestMd5) {
        return res.status(400).json({ message: "MD5 hash is required in request body" });
    }

    const md5 = String(requestMd5).trim();

    try {
        const khqr = new BakongKHQR();
        const apiToken = process.env.BAKONG_TOKEN;
        const apiUrl = process.env.BAKONG_API_URL || "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";

        /* Call Bakong API to check transaction */
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({ md5: md5 })
        });

        const data = await response.json();

        if (response.ok && data.responseCode === 0) {

            /* Payment successful */
            const cartBeforeClear = await Cart.findOne({ user: req.user._id });
            const paidAmount = cartBeforeClear ? await calculateTotal(cartBeforeClear) : 0;
            let telegramResult = null;

            /* Clear the user's cart */
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { items: [], totalAmount: 0 },
                { new: true }
            );

            try {
                telegramResult = await sendPaymentSuccessAlert({
                    userName: req.user?.name,
                    userEmail: req.user?.email,
                    amount: paidAmount,
                    currency: 'USD',
                    md5
                });
            } catch (telegramError) {
                telegramResult = { success: false, error: telegramError.message };
                console.error('Telegram payment alert failed:', telegramError.message);
            }

            res.status(200).json({
                message: "Payment verified success ",
                status: "success",
                telegram: telegramResult,
                details: data
            });
        } else {
            /* Payment not found or failed */
            res.status(200).json({
                message: "Payment not completed or invalid",
                status: "pending",
                details: data
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};