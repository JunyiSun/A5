var express = require('express');
var router = express.Router();
var passport = require('passport');
var tracker = require('../tracker.js')

// GET log out
router.get('/', function(req, res) {
    tracker.trackEvent("Logged out", req.user.email, req.useragent);
    req.logout();
    res.redirect('/');
});

module.exports = router;
