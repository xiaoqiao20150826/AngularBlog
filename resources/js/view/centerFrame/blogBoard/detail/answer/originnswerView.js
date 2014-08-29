/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')

	
	
	var INSERT_ANSWER_DIV = '#insert-answer-div'
	  , EMBEDDED_ANSWER_DIV = '.embedded-answer-div'
		  
	var REPLAY_ANSWER_BTN = '.answer-replay-btn';
	var DELETE_ANSWER_BTN = '';
	
	var answerView = module.exports = {}
	
	var insertAnswerViewHtml = '';
	answerView.init = function () {
		insertAnswerViewHtml = $(INSERT_ANSWER_DIV).html();
	}
	answerView.get$insertViewButtons = function () {
		return $(REPLAY_ANSWER_BTN);
	}
	answerView.get$embeddedAnswerDiv = function ($insertAnswerViewButton) {
		return $insertAnswerViewButton.parent().find(EMBEDDED_ANSWER_DIV)
	}
	answerView.replaceEmbeddedAnswerDiv = function ($embeddedAnswerDiv, answerNum) {
		if(viewUtil.isEmptyChildren($embeddedAnswerDiv)) {
			$embeddedAnswerDiv.html('');
		} else {
			$embeddedAnswerDiv.html(insertAnswerViewHtml);
			var $answerNumInput = $embeddedAnswerDiv.find('.answerNum')
			  , $answerDeepInput = $embeddedAnswerDiv.find('.answerDeep');
			
			$answerNumInput.attr('value', answerNum);
			var deep = $answerDeepInput.attr('value');
			$answerDeepInput.attr('value', ++deep); //현재값 가져와서 1플러스
		}
	}
});