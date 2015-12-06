var Textbook = require('../models/textbook');
var Subject = require('../models/subject');
var View = require('../models/view');
var async = require('async');
var recommendations = require('../recommendations');

// index page
exports.index = function(req, res) {
	var suser = req.session.user;
  Subject
    .find({})
    .populate({
      path: 'textbooks',
      select: 'title photo',
      options: { limit: 5 }
    })
    .exec(function(err, subjects) {
      if (err) {
        console.log(err)
      }

      res.render('index', {
        title: 'DaDatabase',
				sessionuser: suser,
        subjects: subjects
      })
    })
}

//search subject page
exports.search = function(req, res) {
	var suser = req.session.user;
  var subId = req.query.sub
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 5
  var index = page * count

  if (subId) {    //search by find subject
    Subject
      .find({_id: subId})
      .populate({
        path: 'textbooks',
        select: 'title photo'
      })
      .exec(function(err, subjects) {
        if (err) {
          console.log(err)
        }
        var subject = subjects[0] || {}
        var textbooks = subject.textbooks || []
        var results = textbooks.slice(index, index + count)

        res.render('subject_detail', {
          title: 'Subject Detail Page',
          keyword: subject.name,
          currentPage: (page + 1),
          query: 'sub=' + subId,
          totalPage: Math.ceil(textbooks.length / count),
					sessionuser: suser,
          textbooks: results
        })
      })
  }
  else {       // search by searching form
    Textbook
      .find({title: new RegExp(q + '.*', 'i')})  // regular expression -enable search by keyword in title
      .exec(function(err, textbooks) {
        if (err) {
          console.log(err)
        }
        var results = textbooks.slice(index, index + count)

		recommendations.rankTextbooks(suser, results, function(rankedTextbooks) {
			res.render('subject_detail', {
			  title: 'Search Result Page',
			  keyword: q,
			  currentPage: (page + 1),
			  query: 'q=' + q,
			  totalPage: Math.ceil(textbooks.length / count),
						sessionuser: suser,
			  textbooks: rankedTextbooks
			});
		});
	});
  }
}
