var mongoose = require('mongoose');
var ChatSchema = require('../schemas/chat');
var ChatWith = mongoose.model('ChatWith', ChatSchema);

module.exports = ChatWith;
