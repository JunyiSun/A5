$(function(){
	//get delete button
	$('.userDel').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type : 'DELETE',
			url : '/admin/user/list?id=' + id
		})
		.done(function(result){
			if(result.success === 1 && tr){
				tr.remove();
			}
		});
	});
	$(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
});
