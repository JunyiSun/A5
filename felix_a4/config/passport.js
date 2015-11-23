var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var tracker = require('../tracker.js')

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        req.assert('confirm-password', 'Passwords do not match.').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            return done(null, false, { message: 'Passwords do not match.' });
        }

        User.findOne({ 'email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false, { message: 'User already exists.' });
            } else {
                var newUser = new User();

                newUser.email = email;
                newUser.password = password;
                User.count({}, function(err, count) {
                    if (count === 0) {
                        newUser.is_super = true;
                        newUser.is_admin = true;
                    }

                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }

                        tracker.trackEvent("Signed up", email, req.useragent);

                        return done(null, newUser);
                    });
                });
            }

        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'The username and password you entered did not match our records.' })
            }

            if (user.password !== password) {
                return done(null, false, { message: 'The username and password you entered did not match our records.' })
            }

            tracker.trackEvent("Logged in", email, req.useragent);

            return done(null, user);
        });

    }));

};
