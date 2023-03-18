const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User(token owner) Id is required']
    }
}, {timestamps: true})

module.exports = mongoose.model('Token', tokenSchema)