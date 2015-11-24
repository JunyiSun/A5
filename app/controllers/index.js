
// index page
exports.index = function(req,res){
	var suser = req.session.user;
	res.render('index',{
		title:'Homepage',
    sessionuser: suser
	});
};
