var assert = require('assert');
var Textbook = require('../app/models/textbook');
var User = require('../app/models/user');
var View = require('../app/models/view');
var Subject = require('../app/models/subject');
var recommendations = require('../app/recommendations');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/a5_test');

describe('Recommendations', function() {

    describe('#rankTextbooks()', function() {
        var user = new User();
        user.save();

        it('should rank textbooks in order of how many times the user has viewed them', function(done) {
            var textbooks = [];
            var subject = new Subject();
            subject.save();
            for (i = 0; i < 5; i++) {
                var textbook = new Textbook();
                textbook.subject = subject;
                textbook.save();
                textbooks.push(textbook);

                var view = new View();
                view.textbook = textbook;
                view.user = user;
                view.views = i;
                view.save();
            }

            recommendations.rankTextbooks(user, textbooks, function(rankedTextbooks) {
                assert.strictEqual(rankedTextbooks, textbooks.reverse(), '');
            });
            done();
        });

        it('should rank textbooks in order of how many times the user has viewed books of the same subject', function(done) {
            var textbooks = [];
            for (i = 0; i < 5; i++) {
                var subject = new Subject();
                subject.save();

                var textbook = new Textbook();
                textbook.subject = subject;
                textbook.save();
                textbooks.push(textbook);

                var view = new View();
                view.subject = subject;
                view.user = user;
                view.views = i;
                view.save();
            }

            recommendations.rankTextbooks(user, textbooks, function(rankedTextbooks) {
                assert.strictEqual(rankedTextbooks, textbooks.reverse(), '');
            });
            done();
        });

        it('should rank textbooks in order of how many times the user has viewed them and of books of the same subject', function(done) {
            var textbooks = [];
            for (i = 0; i < 5; i++) {
                var subject = new Subject();
                subject.save();

                var textbook = new Textbook();
                textbook.subject = subject;
                textbook.save();
                textbooks.push(textbook);

                var subjectView = new View();
                subjectView.subject = textbook;
                subjectView.user = user;
                subjectView.views = i;
                subjectView.save();

                var bookView = new View();
                bookView.textbook = textbook;
                bookView.user = user;
                bookView.views = i;
                bookView.save();
            }

            recommendations.rankTextbooks(user, textbooks, function(rankedTextbooks) {
                assert.strictEqual(rankedTextbooks, textbooks.reverse(), '');
            });
            done();
        });

    });

});
