// Helper to track user activity

var Event = require('./models/event');

module.exports = {
    
    // event: the event begin recorded
    // email: the email address of the user who caused the event
    // userAgent: the user agent of the user who caused the event
    trackEvent: function(event, email, userAgent) {
        var newEvent = new Event();
        newEvent.email = email;
        newEvent.os = userAgent.os;
        newEvent.browser = userAgent.browser;
        newEvent.mobile = userAgent.isMobile;
        newEvent.event = event
        newEvent.timestamp = Date.now();
        newEvent.save();
    }
}
