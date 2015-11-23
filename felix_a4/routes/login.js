var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET login page
router.get('/', function(req, res, next) {
    var messages = req.session.messages;
    var message = '';
    if (messages !== undefined && messages !== null) {
        message = req.session.messages.pop();
        if (message === undefined || message === null) {
            message = '';
        }
    }
    res.render('login', { title: 'Login', message: message });
});

// POST login
router.post('/', passport.authenticate('local-login', {
    successRedirect : '/users',
    failureRedirect : '/login',
    failureMessage: true,
}));

module.exports = router;
