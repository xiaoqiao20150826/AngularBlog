/**
 * 
 */

$$namespace.include(function (require, module) {


	
	
	var H = require('util/helper')
	  , keyUtil = require('event/content/keyUtil.js')
	var eventHelper = require('/event/eventHelper.js')
	  , EVENT = eventHelper.EVENT
	
	var keyListener = module.exports = {}
	
	keyListener.init = function(editor) {
		var contentBody = editor.getContentBody()
		
		$('body').on(EVENT.keydown, _blockBackspaceOfPage)
		
		$(contentBody).on(EVENT.keydown, _saveHisoryAndEtc1(editor))
	}
	//잘못해서 뒤로가지 않도록.
	function _blockBackspaceOfPage(event) {
		if(keyUtil.isBackSpace({code: event.keyCode})) {
			if(event.target.nodeName == 'INPUT') return // 기본동작수행
			else return eventHelper.stop(event)
		}
	}
	
	function _saveHisoryAndEtc1(_editor) {
		var editor = _editor
		var history = editor.getHistory()
		var updateAndStop = updateAndStop1(editor, eventHelper, history)
		return function (event) {
			
			var downKey = {
		            code: event.keyCode,
		            ctrl: event.ctrlKey || (event.keyCode === 17),
		            alt: event.altKey || (event.keyCode === 18),
		            shift: event.shiftKey || (event.keyCode === 16)
		    };
			
			if(keyUtil.isBackSpace(downKey)) {
				if(!_isToDoBackspace(editor)) return eventHelper.stop(event) 
				//그외 기본동작
			}
			//TODO: 제대로 만드려면 이벤트를 코드로 실행할수있도록 손봐야함.
			if(keyUtil.isUndo(downKey)) { return history.undo();} //히스토리만 순서주의
			if(keyUtil.isKeyToSaveHistory(downKey)) { history.save();}
			
			if(keyUtil.isBold(downKey)) { return updateAndStop('font-weight:bold', event);}
			if(keyUtil.isItalic(downKey)) { return updateAndStop('font-style:italic', event);}
			if(keyUtil.isUnderline(downKey)) { return updateAndStop('text-decoration:underline', event);}
			if(keyUtil.isLineThrough(downKey)) { return updateAndStop('text-decoration:line-through', event);}
			
		}
	}
	function updateAndStop1(editor, eventHelper, history) {
		return function (cssText, event) {
			history.save();
			editor.updateSelectedNodes(cssText)
			return eventHelper.stop(event)
		}
	}
	//backspace가 기본동작해야되는지.
	function _isToDoBackspace(editor) {
		var $lines = editor.get$lines()
		if($lines.length < 1) throw 'someting wrong..';
		if($lines.length > 2) return true;
		
			
		var firstLine = $lines[0]
		  , childNodes = firstLine.childNodes
		  
		if(childNodes.length > 1) return true; // 1개에 대해서만..작업하자.
		
		//이제 이시점에서는 하나의 라인, 하나의 노드(span혹은 텍스트)만 있어
		var textOrSpanNode = childNodes[0]
		if(!H.isTextNode(textOrSpanNode)) { if(textOrSpanNode.childNodes.length > 1 ) return true; }
		
		var oneTextNode = editor.getCurrentSelection().baseNode
		 ,  text = oneTextNode.textContent;  
		if(text.length > 1) return true; //한개의 char에 대해서만... 
	    
		oneTextNode.textContent = editor.getCaretChar();
		return false; //이때만 기본동작하면 안됨.
	}
	
	
});

//@ sourceURL=editor/event/content/keyListener.js