/**
 * 
 */

$$namespace.include(function(require, module){
	
	var INSERT_FORM = '#answer-insertForm'
	  , LOGIN_BTN = '#answer-login'	
		  	
	
	var AnswerView = module.exports = function () {
		
	}
	
	AnswerView.prototype.get$insertForm = function () { return $(INSERT_FORM)}
	AnswerView.prototype.get$loginBtn = function () { return $(LOGIN_BTN)}

	AnswerView.prototype.assignEffect = function() {}
});