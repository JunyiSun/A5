var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    email: String,
    os: String,
    browser: String,
    mobile: Boolean,
    event: String,
    timestamp: Date,
});

module.exports = mongoose.model('Event', EventSchema);
