const CustomerSupport = require('../models/CustomerSupport');

// @desc    User sends a support message
// @route   POST /api/support
// @access  Private (Logged-in users only)
exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Please enter a message" });
        }

        // We get name and email automatically from the logged-in user's token
        const supportTicket = await CustomerSupport.create({
            user: req.user._id,
            name: req.user.name,
            email: req.user.email,
            message
        });

        res.status(201).json({ 
            success: true, 
            message: "Support message sent successfully!",
            data: supportTicket 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin views all support messages
// @route   GET /api/support
// @access  Admin Only
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await CustomerSupport.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};