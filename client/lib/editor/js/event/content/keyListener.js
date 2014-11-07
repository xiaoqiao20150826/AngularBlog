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
	//�߸��ؼ� �ڷΰ��� �ʵ���.
	function _blockBackspaceOfPage(event) {
		if(keyUtil.isBackSpace({code: event.keyCode})) {
			if(event.target.nodeName == 'INPUT') return // �⺻���ۼ���
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
				//�׿� �⺻����
			}
			//TODO: ����� ������� �̺�Ʈ�� �ڵ�� �����Ҽ��ֵ��� �պ�����.
			if(keyUtil.isUndo(downKey)) { return history.undo();} //�����丮�� ��������
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
	//backspace�� �⺻�����ؾߵǴ���.
	function _isToDoBackspace(editor) {
		var $lines = editor.get$lines()
		if($lines.length < 1) throw 'someting wrong..';
		if($lines.length > 2) return true;
		
			
		var firstLine = $lines[0]
		  , childNodes = firstLine.childNodes
		  
		if(childNodes.length > 1) return true; // 1���� ���ؼ���..�۾�����.
		
		//���� �̽��������� �ϳ��� ����, �ϳ��� ���(spanȤ�� �ؽ�Ʈ)�� �־�
		var textOrSpanNode = childNodes[0]
		if(!H.isTextNode(textOrSpanNode)) { if(textOrSpanNode.childNodes.length > 1 ) return true; }
		
		var oneTextNode = editor.getCurrentSelection().baseNode
		 ,  text = oneTextNode.textContent;  
		if(text.length > 1) return true; //�Ѱ��� char�� ���ؼ���... 
	    
		oneTextNode.textContent = editor.getCaretChar();
		return false; //�̶��� �⺻�����ϸ� �ȵ�.
	}
	
	
});

//@ sourceURL=editor/event/content/keyListener.js