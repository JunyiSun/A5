var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app){
	//pre handle user
	app.use(function(req,res,next){
		app.locals.user = req.session.user;
		next();
	});


	// index page
	app.get('/',Index.index);

	// signup
	app.get('/signup',User.showSignup);
	app.post('/user/signup',User.signup);
	// signin
	app.get('/signin',User.showSignin);
	app.post('/user/signin',User.signin);
	// logout
	app.get('/logout',User.logout);

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

	/*
	User.signinRequired
	User.adminRequired 
	 */
};
