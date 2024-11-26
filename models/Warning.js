const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
    userId: String,
    guildId: String,
    moderatorId: String,
    reason: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Warning || mongoose.model('Warning', warningSchema);
