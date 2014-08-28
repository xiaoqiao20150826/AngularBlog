/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')

	
	var INSERT_FILE_BTN = '#blogBoard-insertFile'
	  , INSERT_FORM = '#blogBoard-insertForm'
	  , FILE_URL_NODE = '#fileUrl'
		  
	var InsertView = module.exports = function() {}
	
	InsertView.prototype.init = function () {
	}
	InsertView.prototype.get$insertFileBtn = function () { return $(INSERT_FILE_BTN) }
	InsertView.prototype.get$insertForm = function () {	return $(INSERT_FORM) }
	InsertView.prototype.get$fileUrlNode = function () {	return $(FILE_URL_NODE) }
	
	InsertView.prototype.assignEffect = function () {	}
	
});