const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    id: String,
    
})

module.exports = mongoose.model('user', Schema)