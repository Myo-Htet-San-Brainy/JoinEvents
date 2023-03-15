const CustomError = require('../errors');
const Event = require('../models/event')
const User = require('../models/user');
const UserEvent = require('../models/user-event')
const {checkPermissions} = require('../utils')

const getAllEvents = async (req, res) => {
    const events = await Event.find({})
    res.json({events, noOfEvents: events.length})
}

const getMyEvents = async (req, res) => {
    const {id: userId} = req.user
    const events = await Event.find({createdBy: userId})
    res.json({events, noOfEvents: events.length})
}

const getSingleEvent = async (req, res) => {
    const {id: eventId} = req.params
    const event = await Event.findById(eventId)
    //check if event exists
    if (!event) {
        throw new CustomError.NotFoundError(`No event with id: ${eventId}`)
    }
    res.json({event})
}

const updateEvent = async (req, res) => {
    const {id: eventId} = req.params
    await checkPermissions(req.user, eventId)
    const event = await Event.findByIdAndUpdate(eventId, req.body, {
        runValidators: true,
        new: true
    })
    if (!event) {
        throw new CustomError.NotFoundError(`No event with id: ${eventId}`)
    }
    res.json({event})
}

const deleteEvent = async (req, res) => {
    const {id: eventId} = req.params
    await checkPermissions(req.user, eventId)
    const event = await Event.findByIdAndDelete(eventId)
    if (!event) {
        throw new CustomError.NotFoundError(`No event with id: ${eventId}`)
    }
    //delete all userEvents 
    const userEvents = await UserEvent.deleteMany({eventId})
    res.json({event})
}

const createEvent = async (req, res) => {
    req.body.createdBy = req.user.id
    const event = await Event.create(req.body)
    res.json({event})
}

const joinEvent = async (req, res) => {
    //gather info abt user who wanna join and event which is being joined
    const {id: userId} = req.user
    const {id: eventId} = req.params
    const user = await User.findById(userId)
    const event = await Event.findById(eventId)

    if (!user || !event) {
        throw new CustomError.BadRequestError('Both userId and eventId are required')
    }
    //check if gender eligible
    if (event.gender !== "all") {
        if (event.gender !== user.gender) {
            res.json({"msg": "Gender not eligible"})
            return
        }
    }
    //check if age eligible
    if (!(user.age >= event.age)) {
        res.json({"msg": "Age not eligible"})
        return
    }
    //check if able to join based on event status
    if (event.status !== 'open') {
        res.json({"msg": "Event has closed or is full of seats"})
        return
    }
    //create and persist user-event doc to query users who joined this event
    const userEvent = await UserEvent.create({eventId, userId: user._id})
    //decrement noOfSeats, change event status based on that
    event.noOfSeats -= 1
    if (event.noOfSeats === 0) {
        event.status = 'full of seats'  
    }
    event.save()
    res.json({"msg": "You have joined the event!"})
}

const getUsersJoined = async (req, res) => {
    const {id: eventId} = req.params
    const userEvents = await UserEvent.find({eventId})
    const usersJoined = []
    for (const iterator of userEvents) {
        const user = await User.findById(iterator.userId)
        usersJoined.push(user)
    }
    res.json({usersJoined, noOfUsersJoined: usersJoined.length})
}

const showEventsIJoined = async (req, res) => {
    const {id: userId} = req.user
    const user = await User.findById(userId)
    if (!user) {
        throw new CustomError.NotFoundError('No user found')
    }
    const userEvents = await UserEvent.find({userId: user._id})
    const eventsIJoined = []
    for (const iterator of userEvents) {
        const event = await Event.findById(iterator.eventId)
        eventsIJoined.push(event)
    }
    res.json({eventsIJoined, noOfEventsIJoined: eventsIJoined.length})
}

//temp 
const clearAllData = async (req, res) => {
    await Event.deleteMany({})
    await UserEvent.deleteMany({})
    res.send('all data deleted')
}

module.exports = {
    getAllEvents,
    getMyEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
    createEvent,
    joinEvent,
    getUsersJoined,
    showEventsIJoined,
    clearAllData
}


