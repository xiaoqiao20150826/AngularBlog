/**
 * 
 */

/**
 * 
 */
$$namespace.include(function (require, module) {
	var	INOUTDENT = ".inOutdent-btn",
		INDENT = "indent",
		OUTDENT = "outdent",
		STYLE_ClASS = "margin-left",
		DEFAULT_LEFT_SIZE = 4;

	var eventHelper = require('/event/eventHelper')
	
	var inOutdent = module.exports =  {
			init : function(editor) {
				this._editor = editor;
				this._inOutbtns = editor.getEditorElementsByClassName(INOUTDENT);
				
				var eventType = eventHelper.EVENT.click;
				this.addAction(eventType);
			},
			
			addAction : function(eventType) {
				var	basicList = this._inOutbtns,
					useCapture = false;
				for(var i=0, max= basicList.length; i<max; ++i) {
					var basicBtn = basicList[i],
						data = {self:basicBtn.id},
						bindedCallBack = this._callBack.bind(this, data);
					
					basicBtn.addEventListener(eventType, bindedCallBack, useCapture);
				};
			},
			getStyle : function (target) {
				var size = __getSize(target);
				var style = STYLE_ClASS +":" + size;
				return style;
				
				function __getSize(target) {
					var str = target.style[STYLE_ClASS];
					var unit = "em";
					
					if(target.id ==INDENT) {
						return DEFAULT_LEFT_SIZE + unit;
					} else {
						return "-" +DEFAULT_LEFT_SIZE + unit;
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
