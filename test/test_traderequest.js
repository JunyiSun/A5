'use strict';

var should = require('should');
var mongoose = require('mongoose');
var TradeRequest = require('../app/models/traderequest');
var Textbook = require('../app/models/textbook');
var Subject = require('../app/models/subject');

if (mongoose.connection.readyState == 0){
    mongoose.connect('mongodb://localhost/a5_test');
}

describe('<Unit Test: TradeRequest', function () {
    describe('#create()', function () {
        it('should create a new TradeRequest', function (done) {
            var _tb1 = new Textbook();
            _tb1.title = "Title1";
            var _tb2 = new Textbook();
            _tb2.title = "Title2";
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
                        name: (_tb1.title + " to trade with " + _tb2.title)
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
        it('new traderequest should have name of the form \'x to trade with y\'', function (done) {
            var _tb1 = new Textbook();
            _tb1.title = "Title1";
            var _tb2 = new Textbook();
            _tb2.title = "Title2";
            _tb1.save(function(err, xtb1){
                should.not.exist(err);
                _tb2.save(function(err, xtb2){
                    should.not.exist(err);

                    var trmodel = {
                        userId: "",
                        textbookId: _tb1._id,
                        offerUserId: "",
                        offerTextbookId: _tb2._id,
                        status: 0,
                        name: (_tb1.title + " to trade with " + _tb2.title)
                    }

                    var tr = new TradeRequest(trmodel);
                        tr.save(function (err){
                            should.not.exist(err);
                            tr.name.should.equal("Title1 to trade with Title2");
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
