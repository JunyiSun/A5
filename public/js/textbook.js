$(function(){
//Validation
function funValidate0(obj,min,max){
  $(obj).validate({
    rules:{
      'textbook[title]':{
        required: true
      },
      'textbook[price]':{
        required: true
      },
      'textbook[subject]':{
        require_from_group:[1,".subject_group"]
      },
      'textbook[subjectName]':{
        require_from_group:[1,".subject_group"]
      }
    },
    messages:{
      'textbook[title]':{
        required: 'Require Textbook Title'
      },
      'textbook[price]':{
        required: 'Require Textbook Price'
      },
      'textbook[subject]':{
        require_from_group:'Subject Required'
      },
      'textbook[subjectName]':{
        require_from_group:'Subject Required'
      }
    }
  });
}

funValidate0('#NewTextbookForm',2,20);
});
