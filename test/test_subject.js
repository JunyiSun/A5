var crypto = require('crypto');
var bcrypt = require('bcrypt');

var should = require('should');
//var app = require('../server');
var mongoose = require('mongoose');
var Subject = require('../app/models/subject');
var Subject = mongoose.model('Subject');
var Textbook = require('../app/models/textbook');
var Textbook = mongoose.model('Textbook');

var subject;

describe('<Unit Test', function() {
	describe('Model Subject:', function() {
		before(function(done) {
	  		subject = {
				name: 'Math'
	  	};

	  	done();
		});

	});
	describe('Subject save', function() {
	  it('should save without problems', function(done) {
		var _subject = new Subject(subject);

		_subject.save(function(err) {
			should.not.exist(err);
			_subject.remove(function(err){
				should.not.exist(err);
			});
		});
		done();
	  });

	  it('should not contain any textbooks at first', function(done) {
		var _subject = new Subject(subject);

		_subject.save(function(err) {
		  _subject.textbooks.should.equal(undefined);
		  _subject.remove(function(err) {
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
