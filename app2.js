require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

//rest of packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

//routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

//db
const connectDB = require('./db/connect')

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

//home
app.get('/', (req, res) => {
    console.log(req.signedCookies);
    res.send('Home')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error);
    }
}

start()
