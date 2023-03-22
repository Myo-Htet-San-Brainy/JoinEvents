const {verifyJWT} = require('../utils')
const CustomError = require('../errors')
const Token = require('../models/token')
const {attachCookiesToResponse} = require('../utils')

const auth = async (req, res, next) => {
    const accessCookie = req.signedCookies.accessCookie
    const refreshCookie = req.signedCookies.refreshCookie

    let payload = {}
    
    if (accessCookie) {
        payload = verifyJWT(accessCookie)
        const {name, id} = payload
        req.user = {name, id}
        next()
    }
    else if (refreshCookie) {
        //getting info out of cookie and doing security checks
        payload = verifyJWT(refreshCookie)
        const {name, id, refreshToken} = payload
        const token = await Token.findOne({userId: id, refreshToken})
        if (!token) {
            throw new CustomError.UnauthenticatedError('Authentication Error')
        }
        if (!token.isValid) {
            throw new CustomError.UnauthenticatedError('Authentication Error')
        }
        //doing necessary stuff
        attachCookiesToResponse(res, {name, id}, {name, id, refreshToken})
        req.user = {name, id}
        next()
    }
    else {
        throw new CustomError.UnauthenticatedError('Authentication Error')
    }
}

module.exports = auth