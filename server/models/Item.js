const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'furniture', 'appliances', 'other']
    },
    receiptPath: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Item', ItemSchema); 