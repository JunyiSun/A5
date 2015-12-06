var crypto = require('crypto');
var bcrypt = require('bcrypt');

var should = require('should');
//var app = require('../server');
var mongoose = require('mongoose');
var Textbook = require('../app/models/textbook');
var Textbook = mongoose.model('Textbook');

var textbook;

describe('<Unit Test', function() {
	describe('Model Textbook:', function() {
		before(function(done) {
	  		textbook = {
				title: 'Harry Potter',
				author: 'J.K. Rowling'
	  	};

	  	done();
		});

	});
	describe('Textbook save', function() {
	  it('should save without problems', function(done) {
		var _textbook = new Textbook(textbook);

		_textbook.save(function(err) {
			should.not.exist(err);
			_textbook.remove(function(err){
				should.not.exist(err);
			});
		});
		done();
	  });
	  it('should have default rating 100', function(done) {
		var _textbook = new Textbook(textbook);

		_textbook.save(function(err) {
		  _textbook.rating.should.equal(100);
		  _textbook.remove(function(err) {
		  });
		});
		done();
	  });
	after(function(done){
		//clear user info
		done();
	});
	});
});
