$(function(){
	$('#mediaList').on('click','.chat',function(e){
		var target = $(this);
		var toId = target.data('tid');
		var chatId = target.data('cid');

		$(target).parents('.media-body').attr('id','mediaBody');
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'chat[tid]',
				value:toId
			}).appendTo('#chatForm');
		}

		if($('#chatId').length > 0){
			$('#chatId').val(chatId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'chatId',
				name:'chat[cid]',
				value:chatId
			}).appendTo('#chatForm');
		}
	});


	$('#chats button').on('click',function(event){

		event.preventDefault();
		$.ajax({
			url:'/admin/chat',
			type:'POST',

			data:{'chat[with]':$('#chats input:eq(0)').val(),
				  'chat[from]':$('#chats input:eq(1)').val(),
				  'chat[content]':$('#chats textarea').val(),

				  'chat[tid]':$('#toId').val(),
				  'chat[cid]':$('#chatId').val()
				}
		}).done(function(results){
			var data = results.data || {};

			if(data.reply.length){
				var len = data.reply.length;
				$('#mediaBody').append('<div class="media"><div class="pull-left"><img src="/upload_user/'+data.reply[len-1].from.image+'" style="width: 30px; height: 30px;" /></div><div class="media-body"><h4 class="media-heading">'+data.reply[len-1].from.name+'<span>&nbsp;REPLY&nbsp;</span>'+data.reply[len-1].to.name+'</h4><p>'+data.reply[len-1].content+'</p><span class="createAt">'+format(new Date())+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="chat" href="#chats" data-cid='+data._id+' data-tid='+data.from._id+'> REPLY</a></div></div>');
			}else{
				$('#mediaList').append('<li class="media"><div class="pull-left"><img src="/upload_user/'+data.from.image+'" style="width: 40px; height: 40px;" /></div><div class="media-body"><h4 class="media-heading">'+data.from.name+'</h4><p>'+data.content+'</p><span class="createAt">'+format(new Date())+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="chat" href="#chats" data-cid='+data._id+' data-tid='+data.from._id+'> REPLY</a></div><hr></li>');
			}

			$('#chats textarea').val('');

			$('#mediaBody').removeAttr('id');

			$('#chatForm input:gt(1)').remove();
		});
	});

	
	function padding(number){
		return number < 10 ? '0' + number : '' + number;
	}
	function format(date){
		return padding(date.getMonth() + 1) + '-' + padding(date.getDate()) + ' ' + padding(date.getHours()) + ':' + padding(date.getMinutes());
	}

});
