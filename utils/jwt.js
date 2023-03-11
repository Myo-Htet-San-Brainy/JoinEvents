const jwt = require('jsonwebtoken')

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token
}

const attachCookiesToResponse = (res, userToken) => {
    //create jwt
    const token = createJWT(userToken)
    //response cookie
    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}

const verifyJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    createJWT,
    verifyJWT,
    attachCookiesToResponse
}