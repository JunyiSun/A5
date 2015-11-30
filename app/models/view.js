var mongoose = require('mongoose');
var ViewSchema = require('../schemas/view');

var View = mongoose.model('View', ViewSchema);

module.exports = View;
