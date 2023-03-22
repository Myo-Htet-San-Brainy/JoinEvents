const CustomError = require('../errors');
const User = require('../models/user')
const Token = require('../models/token')
const {attachCookiesToResponse, sendVerificationEmail, sendPasswordReset} = require('../utils')
const crypto = require('crypto');

const register = async (req, res) => {
    //create user
    const verificationToken = crypto.randomBytes(40).toString('hex')
    req.body.verificationToken = verificationToken
    const user = await User.create(req.body)
    //send email verification token to the email used to register
    const origin = 'http://localhost:3000'
    await sendVerificationEmail(user.name, user.rsuEmail, user.verificationToken, origin)
    res.json({"msg": "Success! Please check your email to verify it", verificationToken})
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
    const {rsuEmail, password} = req.body
    //check if user exists
    const user = await User.findOne({rsuEmail})
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    //check if password correct
    const isMatched = await user.comparePassword(password)
    if (!isMatched) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    //check if verified
    if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError('Please verify email before logging in')
    }
    //cookies and response
    const {name, _id} = user
    const userInfo = {name, id: _id}
    let refreshToken = ''
    let userInfoWithRefreshToken = {}
    //check if token already exists
    const existingToken = await Token.findOne({userId: _id})
    if (existingToken) {
        const {isValid} = existingToken
        if (!isValid) {
            throw new CustomError.UnauthenticatedError('Unauthenticated')
        }
        refreshToken = existingToken.refreshToken
        userInfoWithRefreshToken = {name, id: _id, refreshToken}
        attachCookiesToResponse(res, userInfo, userInfoWithRefreshToken)
        res.json({"msg": "Success!"})
        return
    }
    //for first time logging in
    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    await Token.create({refreshToken, ip, userAgent, userId: user._id})

    userInfoWithRefreshToken = {name, id: _id, refreshToken}

    attachCookiesToResponse(res, userInfo, userInfoWithRefreshToken)
    res.json({"msg": "Success!"})
}

const forgotPassword = async (req, res) => {
    const {rsuEmail} = req.body
    if (!rsuEmail) {
        throw new CustomError.BadRequestError('Please provide valid email')
    }
    const user = await User.findOne({rsuEmail})
    if (user) {
        const passwordToken = crypto.randomBytes(40).toString('hex')
        const passwordTokenExpirationDate = 1000 * 60 * 10
        //send Email
        const origin = 'http://localhost:3000'
        sendPasswordReset(user.name, user.rsuEmail, passwordToken, origin)
        user.passwordToken = passwordToken
        user.passwordTokenExpirationDate = new Date(Date.now() + passwordTokenExpirationDate) 
        await user.save()
    }
    
    res.json({"msg": "Please check your email for password reset link"})
}

const resetPassword = async (req, res) => {
    const {passwordResetToken, rsuEmail, password} = req.body
    if (!passwordResetToken || !rsuEmail || !password) {
        throw new CustomError.BadRequestError('Please provide all values')
    }
    const user = await User.findOne({rsuEmail})
    
    if (user) {
        const currentDate = new Date(Date.now())
        console.log(user.passwordToken === passwordResetToken );
        console.log(user.passwordTokenExpirationDate > currentDate );
        if (user.passwordToken === passwordResetToken && user.passwordTokenExpirationDate > currentDate) {
            user.password = password
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
            await user.save()
        }
    }
    res.json({"msg": "Password Reset Success!"})
}

const logout = async (req, res) => {
    res.clearCookie('token')
    res.json({"msg": "Success!"})
}

module.exports = {
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
}

