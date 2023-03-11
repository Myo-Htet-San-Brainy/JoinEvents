require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

//packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

//db
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const eventRouter = require('./routes/eventRoutes')


//middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

//use packages
app.set('trust proxy', 1)
app.use(rateLimiter(
    {
        windowMs: 1000 * 60 * 15, //15 minutes
        max: 100 //limit each IP to 100 requests per windowMs
    }
))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({
    useTempFiles: true
}))
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//setting up routes 
app.get('/', (req, res) => {
    res.send('Home')
})

app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/profile/', userRouter)
app.use('/api/v1/event/', eventRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = 5000 || process.env.PORT
const starter = () => {
    try {
        connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}
starter()