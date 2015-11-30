var mongoose = require('mongoose');

var ViewSchema = new mongoose.Schema({
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject'},
    textbook: {type: mongoose.Schema.Types.ObjectId, ref: 'Textbook'},
    views: {type: Number, default: 0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = ViewSchema;
