/**
 * 
 */
$$namespace.include(function (require, module) {
	var	ID = "#lineStyle";
	
	var dropHelper = require('/event/dropHelper')
	  , eventHelper = require('/event/eventHelper')
	
	var lineStyle = module.exports = {}
	
	lineStyle.init = function(editor) {
		this._editor = editor;
		
		var lineStyleNode = editor.getEditorElementById(ID)
		  , itemClassName = '.' + dropHelper.getItemClassName()
		  , $lineStyleItems = $(lineStyleNode).find(itemClassName)
		
		$lineStyleItems.on('click', _callback1(editor));  
	}
	
	function _callback1(_editor) {
		var editor = _editor;
		
		return function (e) {
			var event =e || window.evnet 
			  , $itemNode = $(this)
			
				var $pNode = $itemNode.find('p').first()
				  , $spanNode = $itemNode.find('span').first()
				var pNodeStyle = $pNode.attr('style')
				  , spanNodeStyle = $spanNode.attr('style')
				var lines = editor.updateSelectedLine(pNodeStyle)
				
				editor.saveAndFocus();
				editor.updateNodesInLines(lines,spanNodeStyle);
			
			//전파종료.
			return ;
		}
	}
		
});
//@ sourceURL=editor/event/button/lineStyle.js