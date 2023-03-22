const jwt = require('jsonwebtoken')

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
}

const attachCookiesToResponse = (res, userInfo, userInfoWithRefreshToken) => {
    //create jwts
    const accessJWT = createJWT(userInfo)
    const refreshJWT = createJWT(userInfoWithRefreshToken)
        
    //attach cookies
    const oneDay = 1000 * 60 * 60 * 24
    const oneMonth = oneDay * 30

    res.cookie('accessCookie', accessJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })

    res.cookie('refreshCookie', refreshJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneMonth),
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