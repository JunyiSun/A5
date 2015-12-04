'use strict';

var should = require('should');
var mongoose = require('mongoose');
var TradeRequest = require('../app/models/traderequest');
var Textbook = require('../app/models/textbook');
var Subject = require('../app/models/subject');

var textbook1, textbook2;

describe('<Unit Test: TradeRequest', function () {
    describe('Models', function() {
		before(function(done) {
	  		textbook1 = {
				title: 'Title1',
				author: 'A'
                
            };
            textbook2 = {
                title: 'Title2',
                author: 'B'
            }

            done();  
		});
	
	});
    describe('#create()', function () {
        it('should create a new TradeRequest', function (done) {
            var _tb1 = new Textbook(textbook1);
            var _tb2 = new Textbook(textbook2);
            _tb1.save(function(err){
                should.not.exist(err);
                _tb2.save(function(err){
                    should.not.exist(err);
                    
                    var trmodel = {
                        userId: "",
                        textbookId: _tb1._id,
                        offerUserId: "",
                        offerTextbookId: _tb2._id,
                        status: 0,  
                        name: (_tb1.title + " for " + _tb2.title)
                    }
                    
                    var tr = new TradeRequest(trmodel);
                    tr.save(function (err){
                        should.not.exist(err);
                        tr.remove(function(err){
                            should.not.exist(err);
                        })
                    });
                });
            });
            done();
        });
        it('new traderequest should have name of the form \'x for y\'', function (done) {
            var _tb1 = new Textbook(textbook1);
            var _tb2 = new Textbook(textbook2);
            _tb1.save(function(err){
                should.not.exist(err);
                _tb2.save(function(err){
                    should.not.exist(err);
                    
                    var trmodel = {
                        userId: "",
                        textbookId: _tb1._id,
                        offerUserId: "",
                        offerTextbookId: _tb2._id,
                        status: 0,  
                        name: (_tb1.title + " for " + _tb2.title)
                    }
                    
                    var tr = new TradeRequest(trmodel);
                    tr.save(function (err){
                        should.not.exist(err);
                        tr.name.should.equal("Title1 for Title2");
                        tr.remove(function(err){
                            should.not.exist(err);
                        })
                    });
                });
            });
            done();
        });
        after(function(done){
            done();
        });
    });
});