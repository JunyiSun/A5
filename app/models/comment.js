var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var CommentTextbook = mongoose.model('CommentTextbook', CommentSchema);

module.exports = CommentTextbook;
