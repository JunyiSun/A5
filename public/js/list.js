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
        e.stopPropagation();
	});


	$(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });


	$('.subjectDel').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type : 'DELETE',
			url : '/admin/subject/list?id=' + id
		})
		.done(function(result){
			if(result.success === 1 && tr){
				tr.remove();
			}
		});
	});

	$('.textbookDel').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type : 'DELETE',
			url : '/admin/textbook/list?id=' + id
		})
		.done(function(result){
			if(result.success === 1 && tr){
				tr.remove();
			}
		});
	});

    $('.traderequestDel').click(function(e){
        var target = $(e.target);
        var id = target.data('id');
		var tr = $('.item-id-' + id);
        $.ajax({
			type : 'DELETE',
			url : '/traderequest/list/reject?id=' + id
		})
        .done(function(res){
            if (res.success === 1 && tr){
                tr.remove();
            }
        });
    });

    $('.traderequestCompl').click(function(e){
        var target = $(e.target);
        var id = target.data('id');
		var tr = $('.item-id-' + id);
        $.ajax({
			type : 'DELETE',
			url : '/traderequest/list/complete?id=' + id
		})
        .done(function(res){
            if (res.success === 1 && tr){
                tr.remove();
            }
        });
    });

});
