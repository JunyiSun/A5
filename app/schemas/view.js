var mongoose = require('mongoose');

var ViewSchema = new mongoose.Schema({
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', index: true},
    textbook: {type: mongoose.Schema.Types.ObjectId, ref: 'Textbook', index: true},
    views: {type: Number, default: 0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
});

module.exports = ViewSchema;
