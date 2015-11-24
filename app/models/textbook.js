var mongoose = require('mongoose');
var TextbookSchema = require('../schemas/textbook');

var Textbook = mongoose.model('Textbook',TextbookSchema);

module.exports = Textbook;
