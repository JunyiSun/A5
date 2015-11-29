var CommentTextbook = require('../models/comment');


exports.save = function(req,res){
	var _comment = req.body.comment;
	var textbookId = _comment.textbook;
	//if cid exist, then it is a reply to the original comment
	if(_comment.cid){
		CommentTextbook.findById(_comment.cid,function(err,comment){
			var reply = {
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content,
				meta: {
			    	createAt: Date.now()
			  	}
			};
			comment.reply.push(reply);

			//save comment
			comment.save(function(err,comment){
				if(err){
					console.log(err);
				}
				//generate a new comment in database and tell front end to display it
				CommentTextbook
					.findOne({_id:comment._id})
					.populate('from','name image')  //search for the name and image of the user who comments
          .populate('reply.from','name image')//search for the name and image of the user who replys to the comment
    			.populate('reply.to','name') // search for the name of the user who is replied
					.exec(function(err,comments){
						res.json({data:comments});
					});
			});
		});
	}
  else{
    //Just a comment to the textbook
		var comment = new CommentTextbook(_comment);
		comment.save(function(err,comment){
			if(err){
				console.log(err);
			}
			CommentTextbook
				.findOne({_id:comment._id})
				.populate('from','name image')
        .populate('reply.from','name image')
  			.populate('reply.to','name')
				.exec(function(err,comments){
					res.json({data:comments});
				});
		});
	}
};

//comment delete
exports.del = function(req,res){
    var cid  = req.query.cid;   //get id of the comment
    var did  = req.query.did;   //get id of all the reply of the comment

    //if click the reply
    if(did !== 'undefined'){
			//search for the reply within the comment, and delete it
    	CommentTextbook.findOne({_id:cid},function(err,comment){
    		var len = comment.reply.length;

    		for(var i=0;i<len;i++){
    			if(comment.reply[i] && comment.reply[i]._id.toString() === did){
    				comment.reply.splice(i,1);
    			}
    		}
			comment.save(function(err,com){
				if(err){
		            console.log(err);
		        }
			});
			res.json({success:1});
    	});
    }else{
	    //if click the original comment, then delete the comment and its reply
	    CommentTextbook.remove({_id:cid},function(err,comment){
	        if(err){
	            console.log(err);
	        }
	        res.json({success:1});
	    });
    }
};
