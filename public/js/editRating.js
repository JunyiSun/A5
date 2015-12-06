$(function(){

	//get up rate button
	$('.increaseRating').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var rate_section = $('.rateBt');
    var rate_score = $('.rateScore');
    var number = rate_score.data('num') + 1;
		$.ajax({
			type : 'PUT',
			url : '/rating?id=' + id
		})
		.done(function(res){
            		if (res.success === 1 && rate_section){
				rate_section.remove();
        rate_score.html(number)
            		}
        	});
	});
  
	//get down rate button
	$('.decreaseRating').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var rate_section = $('.rateBt');
    var rate_score = $('.rateScore');
    var number = rate_score.data('num') - 1;
		$.ajax({
			type : 'PUT',
			url : '/ratingdown?id=' + id
		})
		.done(function(res){
            		if (res.success === 1 && rate_section){
				rate_section.remove();
        rate_score.html(number)
            	}
        	});

	});





});
