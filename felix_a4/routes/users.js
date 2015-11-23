var express = require('express');
var router = express.Router();
var User = require('../models/user');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' })
var tracker = require('../tracker.js')
var Event = require('../models/event');

// GET users page
router.get('/', isLoggedIn, function(req, res, next) {
    tracker.trackEvent("Visited users page", req.user.email, req.useragent);
    User.find({}, function(err, users) {
        res.render('users', { title: 'Users', logged_in_user: req.user, users: users });
    });
});

// GET user profile page
router.get('/:email', isLoggedIn, function(req, res, next) {
    tracker.trackEvent("Visited profile page for " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
    User.findOne({ email: req.params.email}, function(err, user) {
        if (err) {
            res.send(err);
        }

        if (user) {
            if (req.user.email === user.email) {
                res.render('edit_profile', { title: req.params.email, logged_in_user: req.user, user: user, message: ''});
            }
            else {
                Event.find({email: user.email}).sort({timestamp: 'desc'}).exec(function(err, events) {
                    res.render('profile', { title: req.params.email, logged_in_user: req.user, user: user, events: events });
                });
            }
        }
        else {
            res.send(404);
        }
    });
});

// GET edit user profile page
router.get('/update/:email', isLoggedIn, function(req, res) {
    tracker.trackEvent("Visited edit profile page for " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
    User.findOne({ email: req.params.email}, function(err, user) {
        if (err) {
            res.send(err);
        }

        if (user) {
            var messages = req.session.messages;
            var message = '';
            if (messages !== undefined && messages !== null) {
                message = req.session.messages.pop();
                if (message === undefined || message === null) {
                    message = '';
                }
            }

            if (req.user.email === user.email || req.user.is_admin) {
                res.render('edit_profile', { title: req.params.email, logged_in_user: req.user, user: user, message: message });
            }
            else {
                res.send(404);
            }
        }
        else {
            res.send(404);
        }
    });
});

// POST edit user profile
router.post('/update/:email', isLoggedIn, function(req, res) {
    tracker.trackEvent("Edited profile of " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
    User.findOne({ email: req.params.email }, function(err, user) {
        if (err) {
            res.send(err);
        }

        if (user) {

            if (req.body.old_password) {
                var session = req.session;
                var messages = session.messages || (session.messages = []);

                if (req.body.old_password === user.password) {
                    if (req.body.new_password === '') {
                        messages.push('New password cannot be blank.');
                    }
                    else {
                        if (req.body.new_password === req.body.confirm_password) {
                            user.password = req.body.new_password;
                            messages.push('Password changed.');
                        }
                        else {
                            messages.push('New passwords do not match.');
                        }
                    }
                }
                else {
                    messages.push('Old password is incorrect.');
                }
            }
            else {
                if (req.body.display_name) {
                    user.display_name = req.body.display_name;
                }
                if (req.body.description) {
                    user.description = req.body.description;
                }
            }

            user.save(function(err) {
                if (err) {
                    throw err;
                }
                res.redirect('/users/' + encodeURIComponent(user.email));
            });
        }
        else {
            res.send(404);
        }
    });
});

// POST delete user
router.post('/delete/:email', isLoggedIn, function(req, res) {
    tracker.trackEvent("Deleted user: " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
    User.remove({ email: req.params.email }, function(err, removed) {
        Event.remove({ email: req.params.email }, function(events_err, events_removed) {
            res.redirect('/users');
        });
    });
});

// POST toggle user's admin privileges
router.post('/toggle_admin/:email', isLoggedIn, function(req, res) {
    User.findOne({ email: req.params.email }, function(err, user) {
        if (err) {
            res.send(err);
        }

        if (user) {
            user.is_admin = !user.is_admin;

            if (user.is_admin) {
                tracker.trackEvent("Gave admin privileges to " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
            }
            else {
                tracker.trackEvent("Revoked admin privileges of " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
            }

            user.save(function(err) {
                if (err) {
                    throw err;
                }
                res.redirect('/users/' + encodeURIComponent(user.email));
            });
        }
        else {
            res.send(404);
        }
    });
});

// POST upload image and make user's profile picture
router.post('/upload_image/:email', upload.single('image'), function(req, res) {
    tracker.trackEvent("Uploaded image for " + decodeURIComponent(req.params.email), req.user.email, req.useragent);
    User.findOne({ email: req.params.email }, function(err, user) {
        if (err) {
            res.send(err);
        }

        if (user) {
            user.image = req.file.path;
            user.save(function(err) {
                if (err) {
                    throw err;
                }
                res.redirect('/users/' + encodeURIComponent(user.email));
            });
        }
        else {
            res.send(404);
        }
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
