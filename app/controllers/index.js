var Textbook = require('../models/textbook');
var Subject = require('../models/subject');
var View = require('../models/view');
var async = require('async');

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
        title: 'Homepage',
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
  var count = 2
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

		// Store ranking info in 'rankings' with each ranking represented as an array with the textbook as the first element and the weight as the second value
		var rankings = [];
		results.forEach(function(result) {
			rankings.push([result, 0]);
		});

		// Prepare weight calculation tasks
		var weighingTasks = []
		rankings.forEach(function(pair) {
			weighingTasks.push(function(callback) {
				var textbook = pair[0];

				// Look for views of the textbook and of the subject of the textbook by the user
				View.find()
				.and([
					{ $or: [ { subject: textbook.subject }, { textbook: textbook } ] },
					{ user: suser },
				])
				.exec(function (err, viewResults) {
					if (err) {
						console.log(err);
					}
					else {
						// Weight of the result should be the total number of views for the textbook and its subject by the user
						pair[1] += viewResults.reduce(function(previousView, currentView, currentIndex, array) {
							return previousView.views + currentView.views;
						});
					}
					callback()
				});
			});
		});

		// Run tasks to calculate weighting
		async.parallel(weighingTasks, function() {
			// This is run after the weighting is complete

			// Rank result by weight, in descending order (heaviest first)
			rankings.sort(function(first, second) {
				return second[1] - first[1];
			});

			// Get ordered array of textbooks from ranking info
			var rankedItems = rankings.map(function(pair) {
				return pair[0];
			});

			res.render('subject_detail', {
			  title: 'Search Result Page',
			  keyword: q,
			  currentPage: (page + 1),
			  query: 'q=' + q,
			  totalPage: Math.ceil(textbooks.length / count),
						sessionuser: suser,
			  textbooks: rankedItems
		  });
		});
	});
  }
}
