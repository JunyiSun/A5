var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Subject = require('../app/controllers/subject');
var Textbook = require('../app/controllers/textbook');
var TradeRequest = require('../app/controllers/traderequest');
var Comment = require('../app/controllers/comment');
var Chat = require('../app/controllers/chat');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var passport =require('passport');

module.exports = function(app,passport){
	//pre handle user
	app.use(function(req,res,next){
		app.locals.user = req.session.user;
		next();
	});

  // index page
	app.get('/',Index.index);
  app.get('/subject',Index.search);

//section of Google signin ==================================================

app.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));
app.get('/auth/google/callback',
	passport.authenticate('google', { successRedirect: '/',
																			failureRedirect: '/signin' }));
app.get('/connect/google',passport.authorize('google',{scope:['profile','email']}));
//section of user ==============================================================
	// signup
	app.get('/signup',User.showSignup);
	app.post('/user/signup',User.signup);
	// signin
	app.get('/signin',User.showSignin);
	app.post('/user/signin',User.signin);
	// logout
	app.get('/logout',User.logout);

	/*
	User.signinRequired
	User.adminRequired
	 */
	app.post('/user/saveprofile',multipartMiddleware,User.signinRequired,User.saveImage, User.save);
	//app.get('/changepassword',User.signinRequired,User.showchange)
	app.post('/user/changepassword',multipartMiddleware,User.signinRequired,User.changepwd);

  app.get('/regular/user/list',User.signinRequired,User.regularList);
	app.get('/regular/user/profile/:id',User.signinRequired,User.regularProfile);
	app.get('/regular/user/edit/:id',User.signinRequired,User.regularEdit);

	app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.adminList);
	app.get('/admin/user/profile/:id',User.signinRequired,User.adminRequired,User.adminProfile);
	app.get('/admin/user/edit/:id',User.signinRequired,User.adminEdit);
	app.delete('/admin/user/list',User.del);
	app.put('/admin/user/profile',User.makeAdmin);


//section of subject ==========================================================
  app.get('/admin/subject/new',Subject.new);
	app.post('/admin/subject',Subject.save);
	app.get('/admin/subject/list',Subject.list);
	app.delete('/admin/subject/list',Subject.del);


//section of textbook==========================================================
    app.get('/regular/textbook/new', User.signinRequired, Textbook.new);
    app.get('/regular/textbook/update/:id',Textbook.update);
    app.post('/regular/textbook',multipartMiddleware, Textbook.savePhoto, Textbook.submit);
    app.post('/regular/textbook/edit',multipartMiddleware, Textbook.savePhoto, Textbook.save);
    app.get('/regular/textbook/list',Textbook.mylist);

    app.get('/textbook/:id',Textbook.detail);

    app.get('/admin/textbook/update/:id',User.signinRequired,User.adminRequired,Textbook.update);
    app.get('/admin/textbook/list',User.signinRequired,User.adminRequired,Textbook.list);
    app.delete('/admin/textbook/list',Textbook.del);


//section of comment===========================================================
    app.post('/admin/comment',User.signinRequired,Comment.save);
    app.delete('/textbook/:id',Comment.del);

//section of chat =============================================================
    app.post('/admin/chat', Chat.save);
		//app.delete('/regular/user/profile/:id', Chat.del);

//trade requests===============================================================
    app.get('/traderequest/new/:id', TradeRequest.new);
    app.get('/traderequest/make/', TradeRequest.make);
    app.get('/traderequest/list', TradeRequest.list);
    app.delete('/traderequest/list/complete', TradeRequest.complete);
    app.delete('/traderequest/list/reject', TradeRequest.reject);
};
