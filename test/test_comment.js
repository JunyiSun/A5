var crypto = require('crypto');
var bcrypt = require('bcrypt');

//get random str as comment
function getRandomString(len) {
  if (!len) len = 16;

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

var should = require('should');
//var app = require('../server');
var mongoose = require('mongoose');
var User = require('../app/models/user');
var Textbook = require('../app/models/textbook');
var CommentTextbook = require('../app/models/comment');


if (mongoose.connection.readyState == 0){
    mongoose.createConnection('mongodb://localhost/a5_test');
}
describe('<Unit Test: Comment', function () {
    describe('#create comment', function () {
        it('should create a new Comment with textbook from user', function (done) {
            var _tb3 = new Textbook();
            _tb3.title = "Title3";
            var _user1 = new User();
            _user1.name = 'UserName';
            _tb3.save(function(err){
                should.not.exist(err);
                _user1.save(function(err){
                    should.not.exist(err);

                    var commentmodel = {
                      textbook: _tb3._id,
                      from: _user1._id,
                      content: getRandomString(),
                    }

                    var comment = new CommentTextbook(commentmodel);
                    comment.save(function (err){
                        should.not.exist(err);
                        comment.remove(function(err){
                            should.not.exist(err);
                        })
                    });
                });
            });
            done();
        });
        it('should create a reply comment with textbook from user', function (done) {
            var _tb4 = new Textbook();
            _tb4.title = "Title4";
            var _user2 = new User();
            _user2.name = 'UserName2';
            var _user3 = new User();
            _user3.name = 'UserName3'
            _tb4.save(function(err){
                should.not.exist(err);
                _user2.save(function(err){
                    should.not.exist(err);
                   _user3.save(function(err){
                      var commentmodel = {
                        textbook: _tb4._id,
                        from: _user3._id,
                        reply:[{from: _user2._id, to: _user3._id}],
                        content: getRandomString(),
                      }

                    var comment = new CommentTextbook(commentmodel);
                    comment.save(function (err){
                        should.not.exist(err);
                        comment.remove(function(err){
                            should.not.exist(err);
                        })
                    });
                  })
                });
            });
            done();
        });
        after(function(done){
            done();
        });
    });
});
