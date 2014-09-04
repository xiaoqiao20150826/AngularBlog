/**
 * 
 */

$$namespace.include(function(require, module){
	
	//common		  
	var	INPUT_FOR_ANSWER_NUM = '.answer-input4answerNum'
      , CANCEL_BTN = '#answer-cancel'
	  , DELETE_BTNS = '.answer-delete'
		
	//insert
	var INSERT_FORM = '#answer-insertForm'
	  , DIV_FOR_INSERT_VIEW =  '.answer-div4insertView'
	  , INSERT_VIEW_BTNS = '.answer-insertView'
	  , INSERT_VIEW_DIV = '#answer-insertViewDiv'
	
	//update
	var UPDATE_VIEW_BTNS = '.answer-updateView'
	  , ROW_DIV = '.answer-row'
    
	//	  
	var AnswerView = module.exports = function () {}
	
	AnswerView.prototype.get$insertForm = function () { return $(INSERT_FORM)}
	AnswerView.prototype.get$loginBtn = function () { return $(LOGIN_BTN)}
	AnswerView.prototype.get$insertViewBtns = function () { return $(INSERT_VIEW_BTNS)}
	AnswerView.prototype.get$updateViewBtns = function () { return $(UPDATE_VIEW_BTNS)}
	AnswerView.prototype.get$deleteBtns = function () { return $(DELETE_BTNS)}
	
	
	//
	AnswerView.prototype.getInsertViewDivHtml = function () { return $(INSERT_VIEW_DIV).html() }
	
	//TODO: 버튼을 기준으로 찾는것이 나을까. 전체를 기준으로 잡고 찾는것이 나을까.
	AnswerView.prototype.find$currentDiv4InsertView= function ($insertViewBtn) {
		return $insertViewBtn.siblings(DIV_FOR_INSERT_VIEW)
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