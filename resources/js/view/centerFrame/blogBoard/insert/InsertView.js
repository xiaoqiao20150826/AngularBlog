/**
 * 
 */

// insert와 업데이트를 위한 기능도 같이 있다.\\
$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')

	
	var INSERT_FILE_BTN = '#blogBoard-insertFile'
	  , INSERT_FORM = '#blogBoard-insertForm'
	  , FILE_URLS_VIEW_NODE = '#blogBoard-fileUrlsView'
      , FILE_INFOES_STRING_INPUT = '#blogBoard-fileInfoesString'
    
    var ORIGIN_CATEGORY_NODE = '#blogBoard-originCategory'
      , SELECT_PICKER_NODE = '.selectpicker'
    
	var InsertView = module.exports = function() {}
	
	InsertView.prototype.init = function () {
	}
	InsertView.prototype.get$insertFileBtn = function () { return $(INSERT_FILE_BTN) }
	InsertView.prototype.get$insertForm = function () {	return $(INSERT_FORM) }
	InsertView.prototype.get$fileInfoesStringInput = function () {	return $(FILE_INFOES_STRING_INPUT) }
	InsertView.prototype.get$fileUrlsViewNode = function () {	return $(FILE_URLS_VIEW_NODE) }
	
	//update를 위한 것인데 나중에 기능이 더 생기면 분리하자.
	InsertView.prototype.selectCurrentCategory = function () {
		var originCategoryId =  $(ORIGIN_CATEGORY_NODE).val()
		
		if(!originCategoryId) return;
		
		var $selectpicker = this.get$insertForm().find(SELECT_PICKER_NODE)
		  , $options = $selectpicker.children()
		
		$options.each(function (i, option) {
			var categoryId = option.value
			if(categoryId == originCategoryId) return $(option).attr('selected', true)
		})  
		
	}
	//업뎃
	InsertView.prototype.assignEffect = function () {
		this.selectCurrentCategory()
	}
	
});
//@ sourceURL=/view/insertView.js