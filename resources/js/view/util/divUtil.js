/**
 *  //영역(프레임포함)관련 동작.
 */

$$namespace.include(function(require, module){
	
	var CENTER_FRAME = '#centerFrame'
		
	var divUtil = module.exports = {}
	
	divUtil.init = function (app) {
	}

	divUtil.replaceCenterFrame = function (newHtml) {
		$(CENTER_FRAME).html(newHtml)
	};
	divUtil.getCenterFrameHtml = function () {
		return $(CENTER_FRAME).html()
	}
	
	divUtil.replaceDiv= function ($div , html) {
		return $div.replaceWith(html);
	};	
});