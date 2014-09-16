/**
 * 
 */

$$namespace.include(function (require, module) {

	/*
	 * static field, dependency
	 */
	var __KEY = {
		ENTER: '13',
		DELETE: '46',
		SPACE: '32',
		BACKSPACE: '8',
		TAB: '9',
		PASTE: '86', //+ ctrl
		CUT: '88' //+ ctrl
	};
	
	/*
	 * constructor , instance field
	 */
	
	var eventHelper = require('/event/eventHelper')
	  , EVENT = eventHelper.EVENT
	
	var keyListener = module.exports = {}
	keyListener.init = function(editor) {
		var contentBody = editor.getContentBody()
		
		$(contentBody).on(EVENT.keydown, _saveHisoryAndEtc1(editor))
	}
	function _saveHisoryAndEtc1(_editor) {
		var editor = _editor
		return function (event) {
			var history = editor.getHistory()
			var downKey = {
		            code: event.keyCode,
		            ctrl: event.ctrlKey || (event.keyCode === 17),
		            alt: event.altKey || (event.keyCode === 18),
		            shift: event.shiftKey || (event.keyCode === 16)
		    };
			
			if(_isBackSpace(downKey) && editor.isInitContent()) return eventHelper.stop(event);
			
			_saveHistory(downKey, history);
			
//			_blockBackSpace()
		}
	}
	function _saveHistory(key, history) {
		if(_isKeyToSaveHistory(key)) {
			history.save();
		}	
	}
	var _modifiedContent = false;
	function _isKeyToSaveHistory(key) {
		var modified = _modifiedContent;
		if (key.code == 229) {return false; }; // ignore mouse click in ff.
		  
		if (modified && (key.code == __KEY.ENTER || key.code == __KEY.SPACE || key.code == __KEY.TAB)) {
			this._modifiedContent = false;
			return true;
		} else if (_isBackSpace(key)) {
            return true;
        } else if ((key.code == __KEY.PASTE || key.code == __KEY.CUT) && key.ctrl) {
            return true;
        } else if (modified && ((key.code > 32 && key.code < 41) && key.shift) || (key.code == 65 && key.ctrl)) {   // shift + arrow,  home, end,  etc..  / select all
        	this._modifiedContent = false;
        	return true;
        } else if (key.ctrl || key.alt || (key.shift && key.code == 16)) {
            return false;
        } else {
        	this._modifiedContent = true;
        }
	}
	//       check
	function _isBackSpace(key) {
		if(key.code == __KEY.DELETE || key.code == __KEY.BACKSPACE) return true;
		else return false;
	}
	
});

//@ sourceURL=editor/event/content/keyListener.js