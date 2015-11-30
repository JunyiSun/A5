var User = require('../app/models/user');
var configAuth = require('../app/models/auth');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var device = require('express-device');
var requestIp = require('request-ip');

module.exports = function(app, passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
        if (!req.user){
          User.findOne({'google.id':profile.id}, function(err,user){
    				if (err){
    					return done(err);
    				}
    				if(user){
    					return done(null, user)
    				}
    				else{
              var dev = req.device.type;
            	var getip = req.headers['x-forwarded-for'] ||
            	   req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 req.connection.socket.remoteAddress;
              //create a new user with Google profile
    					var newUser = new User();
    					newUser.google.id = profile.id;
    					newUser.google.token = accessToken;
    					newUser.google.name = profile.displayName;
    					newUser.google.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.name = profile.displayName;
              newUser.devices = dev;
  						newUser.ip = getip;
    					newUser.save(function(err){
    						if (err){
    							console.log(err)
    						}
                req.session.user = newUser;
    						return done(null, newUser);
    					})
    				}
    			})
        }
        else{
          var user = req.user;
          user.google.id = profile.id;
          user.google.token = accessToken;
          user.google.name = profile.displayName;
          user.google.email = profile.emails[0].value;
          user.save(function(err){
            if(err){
               console.log(err)
            }
            req.session.user = user;
            return done(null, user)
          })
        }
  		})
    }
  ));

}
