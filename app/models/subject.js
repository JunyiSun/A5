var mongoose = require('mongoose');
var SubjectSchema = require('../schemas/subject');

//使用mongoose的模型方法编译生成模型
var Subject = mongoose.model('Subject',SubjectSchema);

//将模型构造函数导出
module.exports = Subject;
