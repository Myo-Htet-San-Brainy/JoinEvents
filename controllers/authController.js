const CustomError = require('../errors');
const User = require('../models/user')
const {attachCookiesToResponse, sendVerificationEmail} = require('../utils')
const crypto = require('crypto')

const register = async (req, res) => {
    //create user
    const verificationToken = crypto.randomBytes(40).toString('hex')
    req.body.verificationToken = verificationToken
    const user = await User.create(req.body)
    //send email verification token to the email used to register
    const origin = 'http://localhost:3000'
    await sendVerificationEmail(user.name, user.rsuEmail, user.verificationToken, origin)
    res.json({"msg": "Success! Please check your email to verify it"})
}

const verifyEmail = async (req, res) => {
    const { rsuEmail, verificationToken} = req.body
    const user = await User.findOne({rsuEmail})
    if (!user) {
        throw new CustomError.UnauthenticatedError('Verification Failed')
    }
    if (user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthenticatedError('Verification Failed')
    }
    user.isVerified = true
    user.verifiedAt = new Date(Date.now())
    user.verificationToken = ''
    user.save()
    res.json({"msg": "Verification Success!"})
}

const login = async (req, res) => {
    const {email, psw} = req.body
    //check if user exists
    const user = await User.findOne({rsuEmail: email})
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    //check if password correct
    const isMatched = await user.comparePassword(psw)
    if (!isMatched) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    //check if verified
    if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError('Please verify email before logging in')
    }
    //cookies(jwt) and response
    const {name, _id} = user
    const payload = {name, id: _id}
    attachCookiesToResponse(res, payload)
    res.json({user})
}

const logout = async (req, res) => {
    res.clearCookie('token')
    res.send('User logged out')
}

module.exports = {
    login,
    register,
    logout,
    verifyEmail
}

