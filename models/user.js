const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    rsuEmail: {
        type: String,
        required: [true, 'Rsu Email is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /\b[A-Z0-9._%+-]+@rsu.ac.th\b/i.test(v);
            },
            message: props => `${props.value} is not a valid RSU email`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    userImage: {
        type: String,
        required: [true, 'User Image is required'],
        default: 'user.jpeg'
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female'],
            message: `{VALUE} is not supported`
        }
    },
    age: {
        type: Number,
        required: [true, 'Age Image is required'],
    },
    lineId: {
        type: String,
        required: [true, 'LineId is required'],
    },
    phNo: {
        type: String,
        required: [true, 'phNo is required'],
        default: 'Have not provided yet'
    },
    facebook: {
        type: String,
        required: [true, 'Facebook link is required'],
        default: 'Have not provided yet'
    },
    verificationToken: {
        type: String
    },
    verifiedAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordToken: {
        type: String
    },
    passwordTokenExpirationDate: {
        type: Date
    }
}, {timestamps: true})

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(canditatePassword) {
    const isMatched = await bcrypt.compare(canditatePassword, this.password)
    return isMatched
}

module.exports = mongoose.model('User', userSchema)