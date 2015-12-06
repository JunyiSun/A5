var Textbook = require('../models/textbook');
var Subject = require('../models/subject');
var TradeRequest = require('../models/traderequest');
var CommentTextbook = require('../models/comment');
var underscore = require('underscore');
var fs = require('fs');
var path = require('path');
var View = require('../models/view');
var async = require('async');
var recommendations = require('../recommendations');


exports.detail = function(req,res){
	var suser = req.session.user;
	var _id = req.params.id;
	//increase viewed number
	Textbook.update({_id:_id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
		}
	});
	//find all the comments about this textbook and display them
	Textbook.findById(_id,function(err,textbook){
		CommentTextbook
			.find({textbook:_id})
			.populate('from','name image')
			.populate('reply.from','name image')
			.populate('reply.to','name')
			.exec(function(err,comments){
				// Record view of textbook by user
				View.findOne({'textbook': textbook, 'user': suser})
				.exec(function(viewErr, existingView) {
					if (existingView) {
						existingView.views++;
						existingView.save();
					}
					else {
						var newView = new View();
						newView.textbook = textbook;
						newView.user = suser;
						newView.save();
					}
				});

				// Record view of subject by user
				View.findOne({'subject': textbook.subject, 'user': suser})
				.exec(function(viewErr, existingView) {
					if (existingView) {
						existingView.views++;
						existingView.save();
					}
					else {
						var newView = new View();
						newView.subject = textbook.subject;
						newView.user = suser;
						newView.save();
					}
				});

				var recommended = [];
				Textbook.find({subject: textbook.subject, _id: {$ne: textbook}})
				.limit(5)
				.exec(function(err, textbooks) {
					if (err) {
						console.log(err);
					}
					else {
						recommendations.rankTextbooks(suser, textbooks, function(rankedTextbooks) {
							res.render('textbook_detail', {
								title:'Detail',
								sessionuser: suser,
								comments: comments,
								textbook: textbook,
								recommended: rankedTextbooks,
							});
						});
					}
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
			//save to /public/upload_textbook directory
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
	//if there is a uploaded photo, save the photo
	if(req.photo){
		textbookObj.photo = req.photo;
	}

		Textbook.findById(id,function(err,textbook){
			if(err){
				console.log(err);
			}
			if(textbook){    //if textbook already exists, update its info (redundant)
				_textbook = underscore.extend(textbook,textbookObj);
				_textbook.save(function(err,textbook){
					if(err){
						console.log(err);
					}
					res.redirect('/textbook/' + textbook._id);
				});
			}
			else{   //create a new textbook object
        textbookObj.userId = req.session.user._id;
				_textbook = new Textbook(textbookObj);
				var subjectId = textbookObj.subject;
				var subjectName = textbookObj.subjectName;

         //save this new created textbook
				_textbook.save(function(err,textbook){
					if(err){
						console.log(err);
					}
					if(subjectId){  //if user chooses a subject
						Subject.findById(subjectId,function(err,subject){
							subject.textbooks.push(textbook._id);
							subject.save(function(err,subject){
								res.redirect('/textbook/' + textbook._id);
							});
						});
					}else if(subjectName){   //if the user creates a new subject
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
					else{   //of neither, create a subject called other and save the book
						Subject.findOne({name:'Other'},function(err,subjectObj){
							if (err){
								console.log(err);
							}
							if (!subjectObj){
								var subject = new Subject({
									name:'Other',
									textbooks:[textbook._id]
								});
								subject.save(function(err,subject){
									textbook.subject = subject._id;
									textbook.save(function(err,textbook){
										res.redirect('/textbook/' + textbook._id);
									});
								});
							}
							else{      //if other subject already exists, then add the book
									subjectObj.textbooks.push(textbook._id);
									subjectObj.save(function(err,subjectObj){
										res.redirect('/textbook/' + textbook._id);
									});
							}
	          })
					}
				});
			};
		});
};

exports.save = function(req,res){
	var id = req.body.textbook._id;
	var textbookObj = req.body.textbook;
	var _textbook;
	//if there is a uploaded photo, save the photo
	if(req.photo){
		textbookObj.photo = req.photo;
	}

	Textbook.findById(id,function(err,textbook){
		if(err){
			console.log(err);
		}

		if(textbook){
			//use underscore to extend the existing info
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

exports.mylist = function(req,res){
	var suser = req.session.user;
	var sessionid = req.session.user._id;
	Textbook.find({userId:sessionid})
			.populate('subject','name')
			.exec(function(err,textbooks){
					if(err){
							console.log(err);
					}
					res.render('textbook_list_regular',{
							title:'Textbook List',
							sessionuser: suser,
							textbooks:textbooks
					});
			});
}

exports.list = function(req,res){
    var suser = req.session.user;
    var role = req.session.user.role;
    if (role > 10){
        Textbook.find({})
            .populate('subject','name')
            .exec(function(err,textbooks){
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
	var id  = req.query.id;
	if(id){
    //Removing textbooks removes the related traderequests
    TradeRequest.remove({$or:[ {textbookId: id}, {offerTextbookId: id}]}, function(err, rqs){
        if (err) console.log(err);
    });

		Textbook.remove({_id:id},function(err,textbook){
			if(err){
				console.log(err);
			}
			res.json({success:1});
		});
	}
};
exports.updateRating = function(req,res){
	var _id = req.query.id;
  	var suser = req.session.user;
	console.log('hey');
	Textbook.update({_id:_id},{$inc:{rating:1}},function(err){
					if(err){
						console.log(err);
					}
					res.json({success:1});
			  });


};
exports.decreaseRating = function(req,res){
	var _id = req.query.id;
  	var suser = req.session.user;
	console.log('hey');
	Textbook.update({_id:_id},{$inc:{rating:-1}},function(err){
					if(err){
						console.log(err);
					}
					res.json({success:1});
			  });


};
