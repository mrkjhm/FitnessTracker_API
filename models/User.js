const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    userName: {
        type: String,
        required: [true, 'First Name is required']
    },
    // lastName: {
    //     type: String,
    //     required: [true, 'Last Name is required']
    // },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is required']
    },
    info: {
        type: String,
        required: [true, 'Info Number is required']
    },
    avatar: {
        type: String,
        default: 'default'
    }
})

module.exports = mongoose.model('User', userSchema)

