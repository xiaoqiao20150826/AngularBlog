/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')
	
	var CENTER_FRAME = '#centerFrame'
		
	var mainView = module.exports = {}
	
	mainView.init = function (app) {
	}

	mainView.replaceCenterFrame = function (html) {
		viewUtil.replaceDiv($(CENTER_FRAME) , html)
	};
	mainView.getHtmlOfCenterFrame = function () {
		return $(CENTER_FRAME).html()
	}
});