const mongoose = require('mongoose')

const User = mongoose.model('User', {
    registry: String,
    password: String,
})

module.exports = User