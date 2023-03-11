const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/eventController')
const auth = require('../middleware/authentication')

router.route('/').get(auth, getAllEvents).post(auth, createEvent).delete(clearAllData)
router.route('/myEvents').get(auth, getMyEvents)
router.route('/joinEvent/:id').get(auth, joinEvent)
router.route('/usersJoined/:id').get(auth, getUsersJoined)
router.route('/showEventsIJoined').get(auth, showEventsIJoined)
router.route('/:id').get(auth, getSingleEvent).patch(auth, updateEvent).delete(auth, deleteEvent)

module.exports = router


