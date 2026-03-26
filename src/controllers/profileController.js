const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update Profile (Avatar, Name, Password)
// @route   PUT /api/profile/update
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;

        if (user) {
            // 1. Update Name
        if (req.body.name !== undefined) {
            user.name = req.body.name;
        }
        
        // 2. Update New Fields using the same pattern
        if (req.body.birthdate !== undefined) {
            user.birthdate = req.body.birthdate;
        }
        
        if (req.body.home !== undefined) {
            user.home = req.body.home;
        }
        
        if (req.body.city !== undefined) {
            user.city = req.body.city;
        }
        
        if (req.body.homeTown !== undefined) {
            user.homeTown = req.body.homeTown;
        }
        
        if (req.body.phoneNumber !== undefined) {
            user.phoneNumber = req.body.phoneNumber;
        }
            // 2. Handle Password Change
        // 2. Handle Password Change
        if (newPassword && newPassword.trim() !== "") {
            if (user.role === 'admin') {
                // Admin bypasses old password check
                user.password = newPassword; 
            } else {
                // Standard User must verify old password
                if (!oldPassword) {
                    res.status(400);
                    throw new Error('Old password is required');
                }

                // Use the matchPassword method from your User Model
                const isMatch = await user.matchPassword(oldPassword);
                if (!isMatch) {
                    res.status(400);
                    throw new Error('Old password is incorrect');
                }
                
                user.password = newPassword;
            }
        }

            // 3. Update Avatar (Similar to your product image logic)
            // req.file.path contains the Cloudinary URL
            if (req.file) {
                user.avatar = req.file.path;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error); // Using your error handler style
    }
};