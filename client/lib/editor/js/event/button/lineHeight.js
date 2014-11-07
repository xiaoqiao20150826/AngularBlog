/**
 * 
 */

/**
 * 
 */
$$namespace.include(function (require, module) {
	var	LINEHEIGHT = ".lineHeight-btn",
		HEIGHT = "height",
		STYLE_ClASS = "line-height",
		DEFAULT_SIZE = 0.3;

	var eventHelper = require('/event/eventHelper')
	
	var lineHeight = module.exports = {
			_firstCall: true,
			init : function(editor) {
				this._editor = editor;
				this._btns = editor.getEditorElementsByClassName(LINEHEIGHT);
				
				var eventType = eventHelper.EVENT.click;
				this.addAction(eventType);
			},
			
			addAction : function(eventType) {
				var	basicList = this._btns,
					useCapture = false;
				for(var i=0, max= basicList.length; i<max; ++i) {
					var basicBtn = basicList[i],
						data = {self:basicBtn.id},
						bindedCallBack = this._callBack.bind(this, data);
					
					basicBtn.addEventListener(eventType, bindedCallBack, useCapture);
				};
			},
			getStyle : function (target) {
				if(this._firstCall) {
					DEFAULT_SIZE = 1;
					this._firstCall = false;
				} else {
					DEFAULT_SIZE = 0.3;
				}
				var size = __getSize(target);
				var style = STYLE_ClASS +":" + size;
				return style;
				
				function __getSize(target) {
					var str = target.style[STYLE_ClASS];
					
					if(target.id == HEIGHT) {
						return DEFAULT_SIZE;
					} else {
						return "-" +DEFAULT_SIZE;
					}
				};
			},
			_callBack : function(data, e) {
				var event = e || window.event,
					target = e.target || e.srcElement,
					self = data.self,
					editor = this._editor;
			
				if(!(target.id)) { //자식이다.그렇다면
					target = target.parentNode;
				}
				
				var style = this.getStyle(target);
				editor.updateSelectedLine(style);
				editor.saveAndFocus();
				eventHelper.stop(event);

			}
	};
});
