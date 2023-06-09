const CustomError = require('../errors');
const Event = require('../models/event')
const User = require('../models/user');
const UserEvent = require('../models/user-event')
const {checkPermissions, sendDeleteNotiEmail, sendUpdateNotiEmail} = require('../utils')

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
    const event = await Event.findById(eventId)
    if (!event) {
        throw new CustomError.NotFoundError(`No event with id: ${eventId}`)
    }
    await checkPermissions(req.user, eventId)
    await Event.updateOne({_id: eventId}, req.body, {
        runValidators: true,
        new: true
    })
    //notify users who have already joined the event
    if (new Date(Date.now()) < event.dateAndTime) {
        const userEvents = await UserEvent.find({eventId})
        for (const iterator of userEvents) {
            let userId = iterator.userId
            const user = await User.findById(userId).select({name: 1, rsuEmail: 1})
            if (user) {
                let { name, rsuEmail } = user
                await sendUpdateNotiEmail(name, rsuEmail, event)
            }
        }
    }
    res.json({"msg":"Event Update Success!"})
}

const deleteEvent = async (req, res) => {
    const {id: eventId} = req.params
    const event = await Event.findById(eventId)
    if (!event) {
        throw new CustomError.NotFoundError(`No event with id: ${eventId}`)
    }
    await checkPermissions(req.user, eventId)
    event.remove()
    //notify users who have already joined the event
    if (new Date(Date.now()) < event.dateAndTime) {
        const userEvents = await UserEvent.find({eventId})
        for (const iterator of userEvents) {
            let userId = iterator.userId
            const user = await User.findById(userId).select({name: 1, rsuEmail: 1})
            if (user) {
                let { name, rsuEmail } = user
                await sendDeleteNotiEmail(name, rsuEmail, event)
            }
        }
    }
    //delete all userEvents 
    await UserEvent.deleteMany({eventId})
    
    res.json({"msg":"Event Deletion Success!"})
}

const createEvent = async (req, res) => {
    req.body.createdBy = req.user.id
    req.body.dateAndTime = new Date(req.body.dateAndTime)
    const event = await Event.create(req.body)
    res.json({"msg": "Event Creation Success!"})
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
    await UserEvent.create({eventId, userId: user._id})
    //decrement noOfSeats, change event status based on that
    event.noOfSeats -= 1
    if (event.noOfSeats === 0) {
        event.status = 'full of seats'  
    }
    event.save()
    res.json({"msg": "Success! You have joined the event!"})
}

const getUsersJoined = async (req, res) => {
    const {id: eventId} = req.params
    const userEvents = await UserEvent.find({eventId})
    const usersJoined = []
    for (const iterator of userEvents) {
        const user = await User.findById(iterator.userId)
        if (user) {
            usersJoined.push(user)
        }
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
        if (event) {
            eventsIJoined.push(event)
        }
    }
    res.json({eventsIJoined, noOfEventsIJoined: eventsIJoined.length})
}

//temp 
const clearAllData = async (req, res) => {
    await Event.deleteMany({})
    await UserEvent.deleteMany({})
    res.send('all data deletion Success')
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


