const {createJWT, verifyJWT, attachCookiesToResponse} = require('./jwt')
const checkPermissions = require('./checkPermissions')
const sendVerificationEmail = require('./Emails/SendVerificationEmail')
const sendPasswordReset = require('./Emails/SendPasswordReset')

module.exports = {
    createJWT,
    verifyJWT,
    attachCookiesToResponse,
    checkPermissions,
    sendPasswordReset,
    sendVerificationEmail
}