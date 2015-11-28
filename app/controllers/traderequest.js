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
    console.log(requested_txtbk_id);
    console.log(offered_txtbk_id);
    
};

//Nope
exports.checkTR = function (req, res){
    var suser = req.session.user;
    var _id = req.params.id;
    console.log("got it");
    TradeRequest.find({userId: _id}, function (err, trs){
        console.log(trs);
        if (trs.length > 0){
            res.send(true);
        }else{
            res.send(false);
        }
    });
};

//exports.del
//exports.list
