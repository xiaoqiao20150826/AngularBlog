/**
 * 
 */

$$namespace.include(function(require, module){
	
	var INSERT_FORM = '#answer-insertForm'
	  , LOGIN_BTN = '#answer-login'
	  , REPLY_VIEW_BTNS = '.answer-replyView'
	  , UPDATE_VIEW_BTNS = '.answer-updateView'
	  , INSERT_DIV = '#answer-insertDiv'  
	  , DIV_FOR_INSERT_VIEW =  '.answer-div4insertView'
	  , INPUT_FOR_ANSWER_NUM = '.answer-input4answerNum'
	  , ROW_DIV = '.answer-row'
      , CANCEL_BTN = '#answer-cancel'
    	  
	var AnswerView = module.exports = function () {
		
	}
	
	AnswerView.prototype.get$insertForm = function () { return $(INSERT_FORM)}
	AnswerView.prototype.get$loginBtn = function () { return $(LOGIN_BTN)}
	AnswerView.prototype.get$replyViewBtns = function () { return $(REPLY_VIEW_BTNS)}
	AnswerView.prototype.get$updateViewBtns = function () { return $(UPDATE_VIEW_BTNS)}
	
	
	//
	AnswerView.prototype.getInsertDivHtml = function () { return $(INSERT_DIV).html() }
	
	//TODO: 버튼을 기준으로 찾는것이 나을까. 전체를 기준으로 잡고 찾는것이 나을까.
	AnswerView.prototype.find$currentDiv4InsertView= function ($replyViewBtn) {
		return $replyViewBtn.siblings(DIV_FOR_INSERT_VIEW)
	}
	AnswerView.prototype.find$input4answerNum = function ($currentDiv4InsertView) {
		return $currentDiv4InsertView.find(INPUT_FOR_ANSWER_NUM)
	}
	AnswerView.prototype.find$currentCancelBtn = function ($currentDiv4InsertView) {
		return $currentDiv4InsertView.find(CANCEL_BTN)
	}
	
	AnswerView.prototype.find$currentRowDiv = function (num) {
		var selector = ROW_DIV + '[data-num ='+ num + ']'
		return $(selector)
	}
	
	//
	AnswerView.prototype.assignEffect = function() {}
});