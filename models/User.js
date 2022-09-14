const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    registry:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema)

module.exports = User