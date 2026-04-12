const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginTime: { type: Date, default: Date.now },
    ipAddress: { type: String },
    device: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LoginLog', loginLogSchema);