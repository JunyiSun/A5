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
		var id = target.data('id');  //获取点击的id值
		var tr = $('.item-id-' + id);

		$.ajax({
			type : 'DELETE',
			url : '/admin/subject/list?id=' + id
		})
		.done(function(result){
			//如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if(result.success === 1 && tr){
				tr.remove();
			}
		});
	});

	$('.textbookDel').click(function(e){
		var target = $(e.target);
		var id = target.data('id');  //获取点击的id值
		var tr = $('.item-id-' + id);

		$.ajax({
			type : 'DELETE',
			url : '/admin/textbook/list?id=' + id
		})
		.done(function(result){
			//如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if(result.success === 1 && tr){
				tr.remove();
			}
		});
	});
    
});
