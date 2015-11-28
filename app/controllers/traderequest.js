var TradeRequest = require('../models/traderequest');
var Textbook = require('../models/textbook');
var underscore = require('underscore'); 
var fs = require('fs');						
var path = require('path');				


//When the user clicks the 'send request' button
exports.new = function(req,res){
    var suser = req.session.user;
    var _id = req.params.id;
    Textbook.findById(_id, function (err, txtbk){
       if (err){
           console.log("Textbook not found");
       } else{
           Textbook.find({userId: suser._id})
            .populate('subject','name')
            .exec(function (err, textbooks){
                if(err){
                    console.log(err);
                }
                res.render('traderequest_list_textbooks',{
                    title:'Choose a textbook',
                    sessionuser: suser,
                    wanted_textbook: txtbk,
                    textbooks: textbooks
                });
            });
       }
        
    });
};

exports.make = function(req, res){
    var suser = req.session.user;
    var requested_txtbk_id = req.query.rqt;
    var offered_txtbk_id = req.query.offt;
    var trObj= {};
    Textbook.findById(requested_txtbk_id, function(err, txt){
        if (err){
            console.log ("Requested textbook does not exist");
        }else{
            Textbook.findById(offered_txtbk_id, function(err, otxt){
                if (err){
                    console.log ("Offered textbook does not exist");
                }else{
                    trObj.name = txt.title + " for " + otxt.title;
                    trObj.userId = txt.userId;
                    trObj.textbookId = requested_txtbk_id;
                    trObj.offerUserId = suser._id;
                    trObj.offerTextbookId = offered_txtbk_id;
                    _traderequest = new TradeRequest(trObj);
                    _traderequest.save(function (err, tr){
                        if (err) console.log(err);
                        res.redirect('/'); //CHANGE TO THE REQUESTS PAGE LATER
                    });
                }
            });
        }
    });
    console.log(requested_txtbk_id);
    console.log(offered_txtbk_id);
    
};

exports.list = function(req, res){
    var suser = req.session.user;
    TradeRequest.find({userId: suser._id}).exec(function (err, trs){
        if (err) console.log(err);
        TradeRequest.find({offerUserId: suser._id}).exec(function (err, ptrs){
            if (err) console.log(err);
            res.render('traderequest_list_requests', {
                title: 'Trade Requests',
                sessionuser: suser,
                traderequests: trs,
                pending_traderequests: ptrs
            });
        });
        
    });
    
};

exports.del = function(req, res){
    var id  = req.query.id;
	if(id){
        TradeRequest.remove({_id:id},function(err,textbook){
			if(err){
				console.log(err);
			}
			res.json({success:1});
		});
    }
};

//exports.del