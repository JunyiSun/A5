var Textbook = require('../models/textbook');       //电影数据模型
var Subject = require('../models/subject'); //电影分类模型
var CommentTextbook = require('../models/comment');
var underscore = require('underscore');   //该模块用来对变化字段进行更新
var fs = require('fs');						//读写文件模块
var path = require('path');					//路径模块

exports.detail = function(req,res){
	var suser = req.session.user;
	var _id = req.params.id;
	//increase viewed number
	Textbook.update({_id:_id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
		}
	});
	Textbook.findById(_id,function(err,textbook){
		CommentTextbook
			.find({textbook:_id})
			.populate('from','name image')
			.populate('reply.from','name image')//查找评论人和回复人的名字
			.populate('reply.to','name')
			.exec(function(err,comments){
				res.render('textbook_detail',{
					title:'Detail',
					sessionuser: suser,
					comments: comments,
					textbook:textbook
				});
			})
		});
};

exports.new = function(req,res){
    var suser = req.session.user;
	Subject.find({},function(err,subjects){
		res.render('textbook_new',{
			title:'Create Textbook Page',
			subjects:subjects,
            sessionuser: suser,
			textbook:{}
		});
	});
};

exports.savePhoto = function(req, res, next){
	var photoData = req.files.uploadPhoto;    //Upload
	var filePath = photoData.path;			//Path
	var originalFilename = photoData.originalFilename;//Original name

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();  //get time
			var type = photoData.type.split('/')[1]; //get type
			var photo = timestamp + '.' + type;   //rename
			//save to /public/upload directory
			var newPath = path.join(__dirname,'../../','/public/upload_textbook/' + photo);

			fs.writeFile(newPath,data,function(err){
				req.photo = photo;
				next();
			});
		});
	}else{
		//No photo upload
		next();
	}
};

exports.submit = function(req, res){
	var id = req.body.textbook._id;
	var textbookObj = req.body.textbook;
	var _textbook;
	//如果有自定义上传海报  将textbookObj中的海报地址改成自定义上传海报的地址
	if(req.photo){
		textbookObj.photo = req.photo;
	}

		Textbook.findById(id,function(err,textbook){
			if(err){
				console.log(err);
			}
			if(textbook){
				_textbook = underscore.extend(textbook,textbookObj);
				_textbook.save(function(err,textbook){
					if(err){
						console.log(err);
					}
					res.redirect('/textbook/' + textbook._id);
				});
			}
			else{
                textbookObj.userId = req.session.user._id;
				_textbook = new Textbook(textbookObj);
				var subjectId = textbookObj.subject;
				var subjectName = textbookObj.subjectName;

				_textbook.save(function(err,textbook){
					if(err){
						console.log(err);
					}
					if(subjectId){
						Subject.findById(subjectId,function(err,subject){
							subject.textbooks.push(textbook._id);
							subject.save(function(err,subject){
								res.redirect('/textbook/' + textbook._id);
							});
						});
					}else if(subjectName){
						var subject = new Subject({
							name:subjectName,
							textbooks:[textbook._id]
						});
						subject.save(function(err,subject){
							textbook.subject = subject._id;
							textbook.save(function(err,textbook){
								res.redirect('/textbook/' + textbook._id);
							});
						});
					}
				});
			};
		});
};

exports.save = function(req,res){
	var id = req.body.textbook._id;
	var textbookObj = req.body.textbook;
	var _textbook;
	//如果有自定义上传海报  将textbookObj中的海报地址改成自定义上传海报的地址
	if(req.photo){
		textbookObj.photo = req.photo;
	}

	Textbook.findById(id,function(err,textbook){
		if(err){
			console.log(err);
		}

		if(textbook){
			//使用underscore模块的extend函数更新变化的字段
			_textbook = underscore.extend(textbook,textbookObj);
			_textbook.save(function(err,textbook){
				if(err){
					console.log(err);
				}
				res.redirect('/textbook/' + textbook._id);
			});
		}
	});
}

exports.update = function(req,res){
	var _id = req.params.id;
  var suser = req.session.user;

	Textbook.findById(_id,function(err,textbook){
		Subject.find({},function(err,subjects){
			if(err){
				console.log(err);
			}
			res.render('textbook_update',{
				title:'Update Page',
				textbook:textbook,
        sessionuser: suser,
				subjects:subjects
			});
		});
	});
};

exports.list = function(req,res){
    var suser = req.session.user;
    var role = req.session.user.role;
    if (role > 10){
        Textbook.find({})
            .populate('subject','name')
            .exec(function(err,textbooks){
                console.log("ADMIN TEST: ");
                console.log(textbooks);
                if(err){
                    console.log(err);
                }
                res.render('textbook_list_admin',{
                    title:'Textbook List',
                    sessionuser: suser,
                    textbooks:textbooks
                });
            });
    }else{
        Textbook.find({userId: suser._id})
            .populate('subject','name')
            .exec(function (err, textbooks){
                console.log("REGULAR TEST: ");
                console.log(textbooks);
                if(err){
                    console.log(err);
                }
                res.render('textbook_list_regular',{
                    title:'Textbook List',
                    sessionuser: suser,
                    textbooks: textbooks
                });
            });
            
    }
};

exports.del = function(req,res){
	//获取客户端Ajax发送的URL值中的id值
	var id  = req.query.id;
	if(id){
		//如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		Textbook.remove({_id:id},function(err,textbook){
			if(err){
				console.log(err);
			}
			res.json({success:1});
		});
	}
};
