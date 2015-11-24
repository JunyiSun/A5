$(function(){
	//get make admin/revoke admin button
	$('.userAdmin').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
    var bt = $('.user-id-' + id);

		$.ajax({
			type : 'PUT',
			url : '/admin/user/profile?id=' + id
		})
		.done(function(result){
			if(result.success === 1){
        if (bt.text()=='Make Administrator'){
          bt.html('Revoke Administrator');
        }
        else{
          bt.html('Make Administrator');
        }
			}
		});
	});

});
