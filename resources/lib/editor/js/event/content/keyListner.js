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
	
	var keyListner = module.exports = {
			init: function(editor) {
				this._editor = editor;
				this._contentBody = editor.getContentBody();
				
				var eventType = eventHelper.EVENT.keydown;
				this.addAction(eventType);
			},
			addAction:function(eventType) {
				var	contentBody = this._contentBody,
					bindedCallBack = this.callBack.bind(this),
					useCapture = false;
				
				contentBody.addEventListener(eventType, bindedCallBack, useCapture);
			},
			
			callBack: function (e) {
				var event =e || window.evnet, 
					editor = this._editor;
					
				var key = {
			            code: event.keyCode,
			            ctrl: event.ctrlKey || (event.keyCode === 17),
			            alt: event.altKey || (event.keyCode === 18),
			            shift: event.shiftKey || (event.keyCode === 16)
			        };
				
				if(this.checkKey(key)) {
					var history = editor.getHistory();
					history.save();
				} 
				
			},
			checkKey: function (key) {
				var modified = this._modifiedContent;
				if (key.code == 229) {return false; }; // ignore mouse click in ff.
				  
				if (modified && (key.code == __KEY.ENTER || key.code == __KEY.SPACE || key.code == __KEY.TAB)) {
					this._modifiedContent = false;
					return true;
				} else if (key.code == __KEY.DELETE || key.code == __KEY.BACKSPACE) {
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
				 
			},
			
	};
	
	
	
});