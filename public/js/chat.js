$(function(){
	$('#mediaList').on('click','.chat',function(e){
		var target = $(this);
		var toId = target.data('tid');
		var chatId = target.data('cid');
		//给当前要叠楼回复的楼主添加ID值
		$(target).parents('.media-body').attr('id','mediaBody');
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'chat[tid]',//评论人ID
				value:toId
			}).appendTo('#chatForm');
		}

		if($('#chatId').length > 0){
			$('#chatId').val(chatId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'chatId',
				name:'chat[cid]',//该评论，即该叠楼在数据库中的ID
				value:chatId
			}).appendTo('#chatForm');
		}
	});

	//评论区提交评论点击事件
	$('#chats button').on('click',function(event){
		//阻止表单默认发送到服务器行为并发送Ajax请求
		event.preventDefault();
		$.ajax({
			url:'/admin/chat',
			type:'POST',
			//将第一第二隐藏表单中保存的电影ID和用户ID值及评论内容发送给服务器
			data:{'chat[textbook]':$('#chats input:eq(0)').val(),//电影ID
				  'chat[from]':$('#chats input:eq(1)').val(),//用户ID
				  'chat[content]':$('#chats textarea').val(),//评论内容
				  //若点击评论对其回复，就会生成两个隐藏的表单，分别有用户ID和点击该条评论的ID
				  'chat[tid]':$('#toId').val(),//用户ID
				  'chat[cid]':$('#chatId').val()//被点击评论的ID
				}
		}).done(function(results){
			var data = results.data || {};
			//将返回的数据添加到评论列表中
			if(data.reply.length){
				var len = data.reply.length;  //回复评论人的条数
				$('#mediaBody').append('<div class="media"><div class="pull-left"><img src="/upload_user/'+data.reply[len-1].from.image+'" style="width: 30px; height: 30px;" /></div><div class="media-body"><h4 class="media-heading">'+data.reply[len-1].from.name+'<span>&nbsp;REPLY&nbsp;</span>'+data.reply[len-1].to.name+'</h4><p>'+data.reply[len-1].content+'</p><span class="createAt">'+format(new Date())+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="chat" href="#chats" data-cid='+data._id+' data-tid='+data.from._id+'>REPLY</a>&nbsp;|&nbsp;<a class="chatDel" href="javascript:;" data-cid='+data._id+' data-did='+data.reply[len-1]._id+'>DELETE</a></div></div>');
			}else{
				$('#mediaList').append('<li class="media"><div class="pull-left"><img src="/upload_user/'+data.from.image+'" style="width: 40px; height: 40px;" /></div><div class="media-body"><h4 class="media-heading">'+data.from.name+'</h4><p>'+data.content+'</p><span class="createAt">'+format(new Date())+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="chat" href="#chats" data-cid='+data._id+' data-tid='+data.from._id+'>REPLY</a>&nbsp;|&nbsp;<a class="chatDel" href="javascript:;" data-cid='+data._id+'>DELETE</a></div><hr></li>');
			}

			$('#chats textarea').val('');  //发表评论后将评论框内容情况
			//给叠楼回复内容完后要删除给叠楼楼主添加的ID值，方便下次点击其他叠楼楼主继续添加该ID
			$('#mediaBody').removeAttr('id');
			//同样将叠楼评论中新建的两个隐藏表单清空，方便下次回复新内容时不会堆叠到此楼
			$('#chatForm input:gt(1)').remove();
		});
	});

	//格式化时间函数
	function padding(number){
		return number < 10 ? '0' + number : '' + number;
	}
	function format(date){
		return padding(date.getMonth() + 1) + '-' + padding(date.getDate()) + ' ' + padding(date.getHours()) + ':' + padding(date.getMinutes());
	}


	//删除评论功能
	$('#mediaList').on('click','.chatDel',function(event){
		var $omediaBody = $(this).parent('.media-body');//获取点击删除a元素的父节点
		var cid = $(event.target).data('cid');  //获取该删除评论的id
		//如果点击的是叠楼中的回复评论还要获取该回复评论的自身id值
		var did = $(event.target).data('did');

		$.ajax({
			url:'/textbook/:id?cid='+cid+'&did='+did,
			type:'DELETE',
		}).done(function(results){
			if(results.success === 1){
				//获取.media-body的父节点并删除
				$omediaBody.parent().remove();
			}
		});
	});
});
