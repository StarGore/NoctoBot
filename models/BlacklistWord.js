const mongoose = require('mongoose');

const BlacklistWordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('BlacklistedWord', BlacklistWordSchema);
