const mongoose = require('mongoose')

const userEventSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Types.ObjectId,
        ref: 'Event',
        required: [true, 'EventId is required']
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is required']
    }
}, {timestamps: true})

userEventSchema.index({eventId: 1, userId: 1}, {unique: true})

module.exports = mongoose.model('User-Event', userEventSchema)