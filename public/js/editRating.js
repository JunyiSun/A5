$(function(){
    
	//get up rate button
	
	$('.increaseRating').click(function(e){
		var target = $(e.target);
		var id = target.data('id');  

		$.ajax({
			type : 'PUT',
			url : '/rating?id=' + id
		})
		.done(function(res){
            		if (res.success === 1 && tr){
                	target.remove();
			
            	}
        	});
		
	});
	//get up rate button
	
	$('.decreaseRating').click(function(e){
		var target = $(e.target);
		var id = target.data('id');  

		$.ajax({
			type : 'PUT',
			url : '/ratingdown?id=' + id
		})
		.done(function(res){
            		if (res.success === 1 && tr){
                	target.remove();
			
            	}
        	});
		
	});
    	
   
    
    
    
});
