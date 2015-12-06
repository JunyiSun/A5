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
var ChatWith = require('../app/models/chat');


if (mongoose.connection.readyState == 0){
    mongoose.createConnection('mongodb://localhost/a5_test');
}
describe('<Unit Test: Messages', function () {
    describe('#create chat', function () {
        it('should create a new message from one user to another user', function (done) {
            var _user5 = new User();
            _user5.name = 'UserName5';
            var _user6 = new User();
            _user6.name = 'UserName6';

            _user5.save(function(err){
                should.not.exist(err);
                _user6.save(function(err){
                    should.not.exist(err);

                    var messagemodel = {
                      from: _user5._id,
                      to: _user6._id,
                      content: getRandomString(),
                    }

                    var message = new ChatWith(messagemodel);
                    message.save(function (err){
                        should.not.exist(err);
                        message.remove(function(err){
                            should.not.exist(err);
                        })
                    });
                });
            });
            done();
        });
        it('should create a reply message from one user to another', function (done) {
            var _user2 = new User();
            _user2.name = 'UserName2';
            var _user3 = new User();
            _user3.name = 'UserName3'

                _user2.save(function(err){
                    should.not.exist(err);
                   _user3.save(function(err){
                     should.not.exist(err);
                      var messagemodel = {
                        from: _user3._id,
                        to: _user2._id,
                        reply:[{from: _user2._id, to: _user3._id}],
                        content: getRandomString(),
                      }

                    var message = new ChatWith(messagemodel);
                    message.save(function (err){
                        should.not.exist(err);
                        message.remove(function(err){
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
