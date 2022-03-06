const mongoose = require('mongoose');
const schema = mongoose.Schema({
    email: String,
    password: String,
    meteos: []
})

module.exports = mongoose.model('users', schema)