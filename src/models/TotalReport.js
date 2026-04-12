const mongoose = require('mongoose');

const totalReportSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    totalSpent: { 
        type: Number, 
        default: 0 
    },
    orderCount: { 
        type: Number, 
        default: 0 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('TotalReport', totalReportSchema);