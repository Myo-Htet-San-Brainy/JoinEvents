const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        default: "none",
        maxlength: 100
    },
    type: {
        type: String,
        required: [true, 'Event type is required'],
        maxlength: 100
    },
    dateAndTime: {
        type: Date,
        required: [true, 'Date and Time is required'],
    },
    placeToMeetUp: {
        type: String,
        required: [true, 'Event place or place to meet up is required'],
        maxlength: 100
    },
    noOfSeats: {
        type: Number,
        required: [true, 'Number of people allowed to join the event is required'],
    },
    status: {
        type: String,
        required: [true, 'Event status is required'],
        default: 'open',
        enum: {
            values: ['open', 'closed', 'full of seats'],
            message: `{VALUE} is not supported`
        }
    },
    gender: {
        type: String,
        required: [true, 'Gender allowed to join the event is required'],
        default: 'all',
        enum: {
            values: ['all', 'male', 'female'],
            message: `{VALUE} is not supported`
        }
    },
    age: {
        type: Number,
        required: [true, 'Age allowed to join the event is required'],
        default: 18,
    },
    moneyToContribute: {
        type: Number,
        required: [true, 'Money to contribute to the event is required'],
        default: 0
    },
    dresscode: {
        type: String,
        required: [true, 'Dresscode allowed to join the event is required'],
        default: 'none',
        maxlength: 100
    },
    extraNotes: {
        type: String,
        required: [true, 'Extra notes is required'],
        default: 'none',
        maxlength: 100
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event Creator Id is required']
    }
}, {timestamps: true})

module.exports = mongoose.model('Event', eventSchema)