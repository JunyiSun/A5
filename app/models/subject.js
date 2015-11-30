var mongoose = require('mongoose');
var SubjectSchema = require('../schemas/subject');

var Subject = mongoose.model('Subject',SubjectSchema);

module.exports = Subject;
