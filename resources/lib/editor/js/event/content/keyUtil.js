/**
 * 
 */

$$namespace.include(function (require, module) {
	var __KEY = {
			ENTER: '13',
			DELETE: '46',
			SPACE: '32',
			BACKSPACE: '8',
			TAB: '9',
			PASTE: '86', //+ ctrl
			CUT: '88' //+ ctrl
		};
	
	var keyUtil = module.exports = {}
	
//  check
	keyUtil.isBackSpace = function _isBackSpace(key) {
		if(key.code == __KEY.DELETE || key.code == __KEY.BACKSPACE) return true;
		else return false;
	}
	keyUtil.isBold = function (key) {
		if(key.ctrl &&  key.code == 66) return true//b
		else return false;
	}
	keyUtil.isItalic = function (key) {
		if(key.ctrl &&  key.code == 73) return true//i
		else return false;
	}
	keyUtil.isUnderline = function (key) {
		if(key.ctrl &&  key.code == 85) return true//u
		else return false;
	}
	keyUtil.isLineThrough = function (key) {
		if(key.ctrl &&  key.code == 68) return true//d
		else return false;
	}
	keyUtil.isUndo = function (key) {
		if(key.ctrl &&  key.code == 90) return true//z
		else return false;
	}
	
	
	var _modifiedContent = false;
	keyUtil.isKeyToSaveHistory = function _isKeyToSaveHistory(key) {
		var modified = _modifiedContent;
		if (key.code == 229) {return false; }; // ignore mouse click in ff.
		  
		if (modified && (key.code == __KEY.ENTER || key.code == __KEY.SPACE || key.code == __KEY.TAB)) {
			this._modifiedContent = false;
			return true;
		} else if (this.isBackSpace(key)) {
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
})