var View = require('./models/view');
var async = require('async');

module.exports = {
    rankTextbooks: function(user, textbooks, callback) {
        // Store ranking info in 'rankings' with each ranking represented as an array with the textbook as the first element and the weight as the second value
        var rankings = [];
        textbooks.forEach(function(result) {
            rankings.push([result, 0]);
        });

        // Prepare weight calculation tasks
        var weighingTasks = []
        rankings.forEach(function(pair) {
            weighingTasks.push(function(taskCallback) {
                var textbook = pair[0];

                // Look for views of the textbook and of the subject of the textbook by the user
                View.find()
                .and([
                    { $or: [ { subject: textbook.subject }, { textbook: textbook } ] },
                    { user: user },
                ])
                .exec(function (err, viewResults) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // Weight of the result should be the total number of views for the textbook and its subject by the user
                        if (viewResults.length > 0) {
                            pair[1] += viewResults.reduce(function(previousView, currentView, currentIndex, array) {
                                return previousView.views + currentView.views;
                            });
                        }
                    }
                    taskCallback()
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

            callback(rankedItems);
        });
    }
}
