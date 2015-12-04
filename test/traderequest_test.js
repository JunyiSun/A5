'use strict';

//var utils = require('utils');
var should = require('should');
var mongoose = require('mongoose');
var TradeRequest = require('../app/models/traderequest');
var Textbook = require('../app/models/textbook');
var Subject = require('../app/models/subject');

mongoose.connect('mongodb://localhost/tr_test');

beforeEach(function (done) {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, function (err) {
        if (err) {
           throw err;
        }
        return clearDB();
        });
        } else {
            return clearDB();
        }
});

afterEach(function (done) {
    mongoose.disconnect();
    return done();
});

describe('TradeRequests: models', function () {

    describe('#create()', function () {
        it('should create a new TradeRequest', function (done) {
            var subject = {
                name: "Science",
                textbooks: []
            }
            Subject.create(subject, function(errS, createdSubject){
                should.not.exist(errS);
                // Creating two textbooks for the traderequest
                var t1 = {
                    title: "Some title",
                    author: "a",
                    edition: "1st",
                    location: "",
                    language: "EN",
                    summary: "",
                    photo: "",
                    userId: "",
                    subject: createdSubject._id
                };
                var t2 = {
                    title: "Other Title",
                    author: "b",
                    edition: "2nd",
                    location: "",
                    language: "FR",
                    summary: "",
                    photo: "",
                    userId: "",
                    subject: createdSubject._id
                };
                Textbook.create(t1, function (errT1, cText1){
                    should.not.exist(errT1);
                    Textbook.create(t2, function (errT2, cText2){
                        should.not.exist(errT2);
                        
                        var tr = {
                            userId: "",
                            textbookId: cText1._id + "",
                            offerId: "",
                            offerTextbookId: cText2._id + "",
                            status: 0,             //-1: Rejected, 0: Pending, 1: Complete
                            name: (cText1.title + " for " + cText2.title)
                        };
                        
                        TradeRequest.create(tr, function(errTR, cTR){
                            should.not.exist(errTR);
                            cTR.name.should.equal("Some title for Other Title");
                            cTR.textbookId.should.equal(cText1._id + "");
                            cTR.offerTextbookId.should.equal(cText2._id + "");
                            done();
                        });
                        
                    });
                });
            });
        });
    });

});