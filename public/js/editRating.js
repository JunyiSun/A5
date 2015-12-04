$(function(){
    
	//get up rate button
	
	$('.increaseRating').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var rate_section = $('.rate');
		console.log("nice");
		$.ajax({
			type : 'PUT',
			url : '/rating?id=' + id
		})
		//console.log("man");
		.done(function(res){
			
			
            		if (res.success === 1 && rate_section){
				rate_section.remove();
            		}
        	});
		//console.log(res.success);
		
	});
	//get down rate button
	
	$('.decreaseRating').click(function(e){
		var target = $(e.target);
		var id = target.data('id');  
		var rate_section = $('.rate');
		$.ajax({
			type : 'PUT',
			url : '/ratingdown?id=' + id
		})
		.done(function(res){
            		if (res.success === 1 && rate_section){
				rate_section.remove();
			
            	}
        	});
		
	});
    	
   
    
    
    
});
