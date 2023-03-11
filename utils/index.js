const {createJWT, verifyJWT, attachCookiesToResponse} = require('./jwt')
const checkPermissions = require('./checkPermissions')

module.exports = {
    createJWT,
    verifyJWT,
    attachCookiesToResponse,
    checkPermissions
}