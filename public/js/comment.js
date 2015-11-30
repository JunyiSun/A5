$(function(){
	$('#mediaList').on('click','.comment',function(e){
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');

		$(target).parents('.media-body').attr('id','mediaBody');
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId
			}).appendTo('#commentForm');
		}

		if($('#commentId').length > 0){
			$('#commentId').val(commentId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
			}).appendTo('#commentForm');
		}
	});


	$('#comments button').on('click',function(event){

		event.preventDefault();
		$.ajax({
			url:'/admin/comment',
			type:'POST',

			data:{'comment[textbook]':$('#comments input:eq(0)').val(),
				  'comment[from]':$('#comments input:eq(1)').val(),
				  'comment[content]':$('#comments textarea').val(),

				  'comment[tid]':$('#toId').val(),
				  'comment[cid]':$('#commentId').val()
				}
		}).done(function(results){
			var data = results.data || {};

			if(data.reply.length){
				var len = data.reply.length;
				$('#mediaBody').append('<div class="media"><div class="pull-left"><img src="/upload_user/'+data.reply[len-1].from.image+'" style="width: 30px; height: 30px;" /></div><div class="media-body"><h4 class="media-heading">'+data.reply[len-1].from.name+'<span>&nbsp;REPLY&nbsp;</span>'+data.reply[len-1].to.name+'</h4><p>'+data.reply[len-1].content+'</p><span class="createAt">'+format(new Date())+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid='+data._id+' data-tid='+data.from._id+'>REPLY</a>&nbsp;|&nbsp;<a class="commentDel" href="javascript:;" data-cid='+data._id+' data-did='+data.reply[len-1]._id+'>DELETE</a></div></div>');
			}else{
				$('#mediaList').append('<li class="media"><div class="pull-left"><img src="/upload_user/'+data.from.image+'" style="width: 40px; height: 40px;" /></div><div class="media-body"><h4 class="media-heading">'+data.from.name+'</h4><p>'+data.content+'</p><span class="createAt">'+format(new Date())+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid='+data._id+' data-tid='+data.from._id+'>REPLY</a>&nbsp;|&nbsp;<a class="commentDel" href="javascript:;" data-cid='+data._id+'>DELETE</a></div><hr></li>');
			}

			$('#comments textarea').val('');

			$('#mediaBody').removeAttr('id');

			$('#commentForm input:gt(1)').remove();
		});
	});


	function padding(number){
		return number < 10 ? '0' + number : '' + number;
	}
	function format(date){
		return padding(date.getMonth() + 1) + '-' + padding(date.getDate()) + ' ' + padding(date.getHours()) + ':' + padding(date.getMinutes());
	}



	$('#mediaList').on('click','.commentDel',function(event){
		var $omediaBody = $(this).parent('.media-body');
		var cid = $(event.target).data('cid');

		var did = $(event.target).data('did');

		$.ajax({
			url:'/textbook/:id?cid='+cid+'&did='+did,
			type:'DELETE',
		}).done(function(results){
			if(results.success === 1){
				
				$omediaBody.parent().remove();
			}
		});
	});
});
