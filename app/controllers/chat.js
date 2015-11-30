var ChatTextbook = require('../models/chat');


exports.save = function(req,res){
	var _chat = req.body.chat;
	var textbookId = _chat.textbook;
	//if cid exist, then it is a reply to the original chat
	if(_chat.cid){
		ChatTextbook.findById(_chat.cid,function(err,chat){
			var reply = {
				from:_chat.from,
				to:_chat.tid,
				content:_chat.content,
				meta: {
			    	createAt: Date.now()
			  	}
			};
			chat.reply.push(reply);

			//save chat
			chat.save(function(err,chat){
				if(err){
					console.log(err);
				}
				//generate a new chat in database and tell front end to display it
				ChatTextbook
					.findOne({_id:chat._id})
					.populate('from','name image')  //search for the name and image of the user who chats
          .populate('reply.from','name image')//search for the name and image of the user who replys to the chat
    			.populate('reply.to','name') // search for the name of the user who is replied
					.exec(function(err,chats){
						res.json({data:chats});
					});
			});
		});
	}
  else{
    //Just a chat to the textbook
		var chat = new ChatTextbook(_chat);
		chat.save(function(err,chat){
			if(err){
				console.log(err);
			}
			ChatTextbook
				.findOne({_id:chat._id})
				.populate('from','name image')
        .populate('reply.from','name image')
  			.populate('reply.to','name')
				.exec(function(err,chats){
					res.json({data:chats});
				});
		});
	}
};

//chat delete
exports.del = function(req,res){
    var cid  = req.query.cid;   //get id of the chat
    var did  = req.query.did;   //get id of all the reply of the chat

    //if click the reply
    if(did !== 'undefined'){
			//search for the reply within the chat, and delete it
    	ChatTextbook.findOne({_id:cid},function(err,chat){
    		var len = chat.reply.length;

    		for(var i=0;i<len;i++){
    			if(chat.reply[i] && chat.reply[i]._id.toString() === did){
    				chat.reply.splice(i,1);
    			}
    		}
			chat.save(function(err,com){
				if(err){
		            console.log(err);
		        }
			});
			res.json({success:1});
    	});
    }else{
	    //if click the original chat, then delete the chat and its reply
	    ChatTextbook.remove({_id:cid},function(err,chat){
	        if(err){
	            console.log(err);
	        }
	        res.json({success:1});
	    });
    }
};
