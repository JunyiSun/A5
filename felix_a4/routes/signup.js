var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

// GET sign up page
router.get('/', function(req, res, next) {
    var messages = req.session.messages;
    var message = '';
    if (messages !== undefined && messages !== null) {
        message = req.session.messages.pop();
        if (message === undefined || message === null) {
            message = '';
        }
    }
    res.render('signup', { title: 'Sign Up', message: message });
});

// POST sign up
router.post('/', passport.authenticate('local-signup', {
    successRedirect : '/users',
    failureRedirect : '/signup',
    failureMessage: true,
}));

module.exports = router;
