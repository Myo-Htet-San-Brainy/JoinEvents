const CustomError = require('../errors');
const User = require('../models/user')
const Token = require('../models/token')
const Event = require('../models/event')
const UserEvent = require('../models/user-event')
const { sendUpdateNotiEmail, sendDeleteAccNotiEmail} = require('../utils')

const cloudinary = require('cloudinary').v2

const getMyProfile = async (req, res) => {
    const user = await User.findById(req.user.id)
    res.json({user})
}

const updateMyProfile = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        runValidators: true,
        new: true
    })
    res.json({"msg": "Update Profile Success!"})
}

const deleteMyProfile = async (req, res) => {
    //delete events that the user created and notify events 
    const events = await Event.find({createdBy: req.user.id})
            
    for (const event of events) {
        if (new Date(Date.now()) < event.dateAndTime) {
            const userEvents = await UserEvent.find({eventId: event._id})
            for (const iterator of userEvents) {
                let userId = iterator.userId
                const user = await User.findById(userId).select({name: 1, rsuEmail: 1})
                if (user) {
                    let { name, rsuEmail } = user
                    await sendDeleteAccNotiEmail(name, rsuEmail, event)
                }
            }
        }
        await event.remove()    
    }
    
    //logout 
    //delete token related to user
    await Token.findOneAndDelete({userId: req.user.id})
    //remove all cookies
    res.cookie('accessCookie', 'log out', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })

    res.cookie('refreshCookie', 'log out', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'production',
        signed: true        
    })

    //delete user 
    await User.findByIdAndDelete(req.user.id)

    //res
    res.json({"msg": "Account deletion Success!"})
}

const uploadMyImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'JoinEvents-User-Images'
        }
    )
    res.json({src: result.secure_url})
}

const getSingleUserProfile = async (req, res) => {
    const {id: userId} = req.params
    const user = await User.findById(userId)
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${userId}`)
    }
    res.json({user})
}

//temp
const deleteAllUsers = async (req, res) => {
    await User.deleteMany({})
    //also all tokens
    await Token.deleteMany({})
    res.json({"msg": "All users deletion Success!"})
}

module.exports = {
    getMyProfile,
    updateMyProfile,
    uploadMyImage,
    getSingleUserProfile,
    deleteMyProfile,
    deleteAllUsers
}

