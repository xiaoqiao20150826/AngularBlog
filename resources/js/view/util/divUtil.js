/**
 *  //영역(프레임포함)관련 동작.
 */

$$namespace.include(function(require, module){
	
	var CENTER_FRAME = '#centerFrame'
	var CONTENT_FRAME = '#contentFrame'
	var ANSWER_DIV = '#answer-div'
		
	var divUtil = module.exports = {}
	
	divUtil.init = function (app) {
	}

	divUtil.replaceCenterFrame = function (newHtml) { $(CENTER_FRAME).html(newHtml)	};
	divUtil.replaceContentFrame = function (newHtml) { $(CONTENT_FRAME).html(newHtml)	};
	//사용하나요.
	divUtil.getCenterFrameHtml = function () { return $(CENTER_FRAME).html()}
	
	divUtil.replaceAnswerDiv= function (newHtml) { $(ANSWER_DIV).html(newHtml)	};
	
	divUtil.replaceDiv= function ($div , html) { return $div.replaceWith(html);	};	
});