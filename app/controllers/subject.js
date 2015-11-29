var Subject = require('../models/subject');

// admin new page
exports.new = function(req, res) {
  var suser = req.session.user;
    res.render('subject_admin', {
        title: 'New Subject',
        sessionuser: suser,
        subject: {}
    });
};

// admin post movie
exports.save = function(req, res) {
    var _subject = req.body.subject;
    var subject = new Subject(_subject);

    subject.save(function(err, subject) {
        if (err) {
            console.log(err);
        }

       res.redirect('/admin/subject/list');
  });
};

// catelist page
exports.list = function(req, res) {
  var suser = req.session.user;
    Subject.fetch(function(err, subjects) {
        if (err) {
            console.log(err);
        }
        res.render('subject_list', {
            title: 'Subject List',
            sessionuser: suser,
            subjects: subjects
        });
    });
};

//list delete subjects
exports.del = function(req,res){
    var id  = req.query.id;
    if(id){
        Subject.remove({_id:id},function(err,subject){
            if(err){
                console.log(err);
            }
            res.json({success:1});
        });
    }
};
