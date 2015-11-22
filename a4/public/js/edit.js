$(function(){
//Validation
function funValidate1(obj,min,max){
  $(obj).validate({
    rules:{
      'user[password]':{
        required:true
      },
      'user[newpassword]':{
        required:true,
        minlength:min,
        maxlength:max
      },
      'user[confirmnewpassword]':{
        equalTo:'#dChangenewPassword'
      }
    },
    messages:{
      'user[password]':{
        required:'Old password is required'
      },
      'user[newpassword]':{
        required:'New password is required',
        minlength:'Min password length is '+min,
        maxlength:'Max password length is '+max
      },
      'user[confirmnewpassword]':{
        equalTo:'Passwords do not match'
      }
    }
  });
}

//Ajax Checking
function funAjax1(obj,url,method,callback){
  $.ajax({
    url:url,
    type:method,
    //Send email and old,new,confirm password to server
    data:{'user[email]':$(obj).find('input:eq(0)').val(),
        'user[password]':$(obj).find('input:eq(1)').val(),
         'user[newpassword]':$(obj).find('input:eq(2)').val(),
         'user[confirmnewpassword]':$(obj).find('input:eq(3)').val()
    }
  }).done(callback);
}

/*
  change password
 */
funValidate1('#dChangeForm',2,20);

$('#dChangeForm').submit(function(event){
  event.preventDefault();

  funAjax1(this,'/user/changepassword','POST',function(results){
    switch(results.data){
      case 0:
        $('#dChangeForm .err_tip1').html('Account Does Not Exist').attr('style','block');
        break;
      case 1:
        $('#dChangeForm .err_tip1').html('Password Does Not Match Email').attr('style','block');
        break;
      case 2:
        $('#dChangeForm .err_tip1').html('Passwords do not match').attr('style','block');
        break;
      default:
        //Successfully Change password
        $('a')[0].click();
    }
  });
});


});
