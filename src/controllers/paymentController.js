const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");
const Cart = require("../models/Cart");
const crypto = require("crypto");

/**
 * @desc    Step 1: Generate KHQR for Cart
 * @route   POST /api/payment/charge
 */
exports.chargeCart = async (req, res) => {
    try {
        // 1. Fetch the user's cart from Atlas
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Calculate Total Price (Always calculate server-side for real money!)
        // const totalAmount = cart.items.reduce((acc, item) => {
        //     return acc + (item.product.price * item.quantity);
        // }, 0);
        const totalAmount = cart.items.reduce((acc, item) => {
            // Skip items if the product was deleted from the database
            if (!item.product || typeof item.product.price === 'undefined') {
                return acc; 
            }
            return acc + (Number(item.product.price) * item.quantity);
        }, 0);

        // Format to 2 decimal places for USD precision
        const finalAmount = parseFloat(totalAmount.toFixed(2));

        if (finalAmount <= 0) {
            return res.status(400).json({ message: "Invalid total amount. Check if products still exist." });
        }

        // 3. Setup Bakong Individual Info
        const optionalData = {
            currency: khqrData.currency.usd, // Using USD as requested
            amount: totalAmount,
            billNumber: `CS-${Date.now().toString().slice(-6)}`,
            mobileNumber: "85587575857",
            storeLabel: "CamStyle Shop",
            terminalLabel: "Mobile-App",
            expirationTimestamp: Date.now() + (5 * 60 * 1000), // 5 minutes expiry
        };

        // const individualInfo = new IndividualInfo(
        //     process.env.BAKONG_INDIVIDUAL_ID,
        //     khqrData.currency.usd,
        //     process.env.BAKONG_ACCOUNT_NAME,
        //     "Phnom Penh",
        //     optionalData
        // );
        const individualInfo = new IndividualInfo(
            process.env.BAKONG_INDIVIDUAL_ID,   // "devit@abaa"
            process.env.BAKONG_ACCOUNT_NAME,    // "Devit Huotkeo"
            "Phnom Penh",                       // Merchant City
            khqrData.currency.usd,              // Currency (USD)
            optionalData                        // Object containing amount
        );

        const khqr = new BakongKHQR();
        const response = khqr.generateIndividual(individualInfo);
        const qrString = response.data.qr;

        // 4. Generate MD5 for transaction tracking
        const md5 = crypto.createHash('md5').update(qrString).digest("hex");

        // Send 'Payment Pending' response to frontend
        res.status(200).json({
            success: true,
            message: "payment pending",
            qrCode: qrString,
            md5: md5,
            amount: totalAmount
        });

    } catch (error) {
        res.status(500).json({ message: "Generation failed", error: error.message });
    }
};

/**
 * @desc    Step 2: Verify Payment & Clear Cart
 * @route   POST /api/payment/verify
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { md5 } = req.body;

        if (!md5) return res.status(400).json({ message: "MD5 hash is required" });

        // 1. Check transaction with Bakong Production API
        // This requires the BAKONG_API_TOKEN in your env
        const check = await BakongKHQR.checkBakongAccount(
            process.env.BAKONG_API_URL,
            md5
        );

        // 2. Handle Status Logic
        // responseCode 0 = Success in Bakong Open API
        if (check && check.responseCode === 0) {
            
            // SUCCESS: Delete the cart for this user
            await Cart.findOneAndDelete({ user: req.user._id });

            return res.status(200).json({
                status: "payment success",
                message: "Verified and cart cleared."
            });

        } else if (check && check.responseCode === 1) {
            // Transaction still waiting
            return res.status(200).json({
                status: "payment pending",
                message: "User has not paid yet."
            });
        } else {
            // QR Expired or transaction failed
            return res.status(400).json({
                status: "payment fail",
                message: "QR code expired or payment failed."
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Verification error", error: error.message });
    }
};