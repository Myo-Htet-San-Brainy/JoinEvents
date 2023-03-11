const {verifyJWT} = require('../utils')
const CustomError = require('../errors')

const auth =  (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Error')
    }
    const payload = verifyJWT(token)
    const {name, id} = payload
    req.user = {name, id}
    next()
}

module.exports = auth