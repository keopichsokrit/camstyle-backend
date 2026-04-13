const mongoose = require('mongoose');

const customerSupportSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Resolved'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('CustomerSupport', customerSupportSchema);