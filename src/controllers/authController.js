// src/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail'); // Import the utility
const LoginLog = require('../models/Log'); // Ensure path and filename match your Log.js

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({ name, email, password });

        if (user) {
            // Notice: No token is returned here, only success confirmation
            res.status(201).json({
                message: 'User registered successfully. Please login to continue.',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
// src/controllers/authController.js

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {

            // Record the login in the background (non-blocking)
            await recordLogin(user._id, req);

            // Return ONLY the token as requested
            res.json({
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};
// src/controllers/authController.js

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        // req.user is populated by the protect middleware we built earlier
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                birthdate: user.birthdate,
                home: user.home,
                city: user.city,
                homeTown: user.homeTown,
                phoneNumber: user.phoneNumber
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
    // --- NEW OTP & PASSWORD RESET FUNCTIONS ---
};
// @desc    Step 1: Forgot Password - Send OTP
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error('No account found with that email');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'CamStyle Password Reset Code',
            message: `Hello ${user.name},\n\nYour password reset code is: ${otp}.\n\nThis code expires in 10 minutes.`
        });

        res.json({ message: 'OTP sent to your email successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Step 2: Reset Password using OTP
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired OTP');
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        next(error);
    }
};

// --- 1. SEPARATE HELPER FUNCTION ---
// This handles the background task of saving the log
const recordLogin = async (userId, req) => {
    try {
        await LoginLog.create({
            user: userId,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            device: req.headers['user-agent']
        });
    } catch (error) {
        console.error("Login Log Error:", error.message);
    }
};

// --- 2. NEW VIEW FUNCTION ---
// @desc    Get all login history for the current user
// @route   GET /api/auth/logs
// @access  Private
const getMyLoginLogs = async (req, res, next) => {
    try {
        const logs = await LoginLog.find({ user: req.user._id })
            .sort({ createdAt: -1 }) // Newest first
            .limit(20); // Last 20 logins
        res.json(logs);
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword, getMyLoginLogs };