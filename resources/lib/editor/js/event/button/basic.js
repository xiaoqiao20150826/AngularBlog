/**
 * 
 */

/**
 * 
 */
$$namespace.include(function (require, module) {
	var	BASIC = ".basic-btn";

	var eventHelper = require('/event/eventHelper')
	
	var basic = module.exports =  {
			init : function(editor) {
				this._editor = editor;
				this._basicList = editor.getEditorElementsByClassName(BASIC);
				
				var eventType = eventHelper.EVENT.click;
				this.addAction(eventType);
			},
			
			addAction : function(eventType) {
				var	basicList = this._basicList,
					useCapture = false;
				for(var i=0, max= basicList.length; i<max; ++i) {
					var basicBtn = basicList[i],
						data = {args:[basicBtn.id, false, null]},
						bindedCallBack = this._callBack.bind(this, data);
					
					basicBtn.addEventListener(eventType, bindedCallBack, useCapture);
				};
			},
			
			_callBack : function(data, e) {
				var event =e || window.event,
					editor = this._editor,
					target = e.target || e.srcElement;
		
				if(!(target.id)) { //자식이다.그렇다면
					target = target.parentNode;
				}
				if(target.id.indexOf('Justify') != -1 ) {
					editor.updateSelectedNodeByExecCommand.apply(editor,data.args);
					editor.saveAndFocus();
				} else {
					var style = target.style.cssText;
					editor.updateSelectedNodes(style);		
					editor.saveAndFocus();
				}

				
				eventHelper.stop(event);
			}
	};
});
