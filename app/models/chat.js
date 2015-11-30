var mongoose = require('mongoose');
var ChatSchema = require('../schemas/chat');
var ChatTextbook = mongoose.model('ChatTextbook', ChatSchema);

module.exports = ChatTextbook;
