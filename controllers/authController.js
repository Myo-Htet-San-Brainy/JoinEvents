const CustomError = require('../errors');
const User = require('../models/user')
const {attachCookiesToResponse} = require('../utils')

const register = async (req, res) => {
    //create user
    const user = await User.create(req.body)
    //cookies(jwt) and response
    const {rsuEmail, name} = user
    const payload = {rsuEmail, name}
    attachCookiesToResponse(res, payload)
    res.json({user})
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
    logout
}

