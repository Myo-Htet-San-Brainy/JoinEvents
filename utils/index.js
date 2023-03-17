const {createJWT, verifyJWT, attachCookiesToResponse} = require('./jwt')
const checkPermissions = require('./checkPermissions')
const sendVerificationEmail = require('./Emails/SendVerificationEmail')
const sendPasswordReset = require('./Emails/SendPasswordReset')
const sendDeleteNotiEmail = require('./Emails/SendDeleteNotiEmail')
const sendUpdateNotiEmail = require('./Emails/SendUpdateNotiEmail')

module.exports = {
    createJWT,
    verifyJWT,
    attachCookiesToResponse,
    checkPermissions,
    sendPasswordReset,
    sendVerificationEmail,
    sendDeleteNotiEmail,
    sendUpdateNotiEmail
}