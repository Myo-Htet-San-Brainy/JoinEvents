const CustomError = require('../errors');
const User = require('../models/user')
const Token = require('../models/token')
const Event = require('../models/event')
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
    res.json({user})
}

const deleteMyProfile = async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id)
    if (!user) {
        throw new CustomError.NotFoundError('User has already been deleted')
    }
    //delete related events
    const events = await Event.deleteMany({createdBy: user._id})
    //log user out
    res.clearCookie('token')
    res.json({user})
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

const deleteAllUsers = async (req, res) => {
    await User.deleteMany({})
    //also all tokens
    await Token.deleteMany({})
    res.json({"msg": "Deleted all users!"})
}

module.exports = {
    getMyProfile,
    updateMyProfile,
    uploadMyImage,
    getSingleUserProfile,
    deleteMyProfile,
    deleteAllUsers
}

