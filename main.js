// Hàm validator
function Validator(options) {
    function getParent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};
// hàm thực hiện validate
    function validate(inputElement, rule){
        
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage ;   
      // lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        //lặp qua từng rules và kiểm tra 
        // nếu có lỗi dừng việc kiểm tra
        for(var i=0; i<rules.length; ++i){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                errorMessage =   rules[i](
                    formElement.querySelector(rule.selector + ':checked')
                )
                break; 
                default:
                    errorMessage =   rules[i](inputElement.value)
            }
           
        if(errorMessage) break;
        }
        if(errorMessage){
         errorElement.innerHTML = errorMessage;
         getParent(inputElement,options.formGroupSelector).classList.add('invalid')
       }else{
          errorElement.innerHTML = '';
          getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
       }
       return !errorMessage;
    }
    // lấy ra formElement của form cần validate
var formElement = document.querySelector(options.form);
if(formElement) {
    //khi submit form
    formElement.onsubmit = function(e){
        e.preventDefault();

        var isFormValid = true;
        // lặp qua từng rule và validate
        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
          
           var isValid = validate(inputElement, rule);
            if(!isValid){
                isFormValid = false;
            }
        });
       

        if(isFormValid){
            //trường hợp submit với javascript
         if(typeof options.onSubmit === 'function'){
            var enableInputs = formElement.querySelectorAll('[name]');
        
        var formValues = Array.from(enableInputs).reduce(function(values, input) {
               switch(input.type){
                   case 'radio':
                       case 'checkbox':
                        values[input.name] = formElement.querySelector('input[name = "' + input.name + '"]:checked').value;
                      break;
                      case 'file': values[input.name] = input.files;
                      break;
                       default:
                        values[input.name] = input.value;
               }
                return values
                ;
        },{});
            options.onSubmit(formValues)
         }else{// submit với hành vi mặc định
                formElement.submit();
         }
        }
    }

    //xử lý lặp qua mỗi rule và xử lý (lắng nghe sự kiện)
options.rules.forEach(function(rule) {
    //Lưu lại các rules trong mỗi inputElement
    if(Array.isArray(selectorRules[rule.selector])){
        selectorRules[rule.selector].push(rule.test);
    }else{
        selectorRules[rule.selector] = [rule.test];
    }
    var inputElements = formElement.querySelectorAll(rule.selector)
    // var errorElement = getParent(inputElement,options.formGroupSelector).querySelector('.form-message');
    Array.from(inputElements).forEach(function (inputElement) {
   //xử lý trường hợp blur ra khỏi input
   inputElement.onblur = function() {
    validate(inputElement, rule);
    }
    //xử lý mỗi khi người dùng nhập vào input
    inputElement.oninput = function() {
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        errorElement.innerText = '';
        getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
    }


})  ; 
  
});
console.log(selectorRules)
 
}
}
// định nghĩa rules, function xử lý required
// nguyên tắc của của rules 
//1. khi có lỗi trả ra message lỗi
//2. khi hợp lệ => không trả ra cái gì 
Validator.isRequired = function(selector){
return {
    selector : selector,
    test: function (value){
        return value ? undefined : 'Vui lòng nhập trường này'
    }
}
}
// định nghĩa rules, function xử lý required
Validator.isEmail = function(selector){
   return {
    selector : selector,
    test: function(value){// đưa ra value nhận vào
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) ? undefined : "Trường này phải là Email"
    }
}
}
Validator.minLength = function(selector, min, message){
    return {
     selector : selector,
     test: function(value){// đưa ra value nhận vào
        
         return value.length >= min ? undefined : `Vòng lòng nhập tối thiểu ${min} ký tự`
     }
 }
 }
 Validator.isConfirmed = (selector, getConfirmValue,message) =>{// getConfirmValue là callBacks
     return{
         selector : selector,
         test : function(value) {
            //  nếu value = với value getConfirmValue return thì không có lỗi
return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
         }
     }
 }
