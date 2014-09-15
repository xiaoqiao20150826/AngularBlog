/**
 * 
 */
$$namespace.include(function (require, module) {
	var	ID = "#lineStyle";
	
	var dropHelper = require('/event/dropHelper')
	  , eventHelper = require('/event/eventHelper')
	
	var lineStyle = module.exports = {
		init : function(editor) {
			this._editor = editor;
			this._btnNode = editor.getEditorElementById(ID);
			this._menuNode = dropHelper.getMenuElement(this._btnNode);
			
			var eventType = eventHelper.EVENT.click;
			this.addAction(eventType);
		},

		addAction : function(eventType) {
			var btnNode = this._btnNode,
				data = {self:btnNode, menu:this._menuNode},
				bindedCallBack = this.callBack.bind(this, data),
				useCapture = false;
				
			btnNode.addEventListener(eventType, bindedCallBack, useCapture);	
		},
		callBack : function(data, e) {
			var event =e || window.evnet, 
				target = e.target || e.srcElement,
				editor = this._editor;
			
			//하위메뉴에서 전파되었을경우.
			if(dropHelper.isItemNode(target)) {
				var pNode = target.firstChild,
					spanNode = pNode.firstElementChild;
				var pNodeStyle = pNode.style.cssText,
					spanNodeStyle = spanNode.style.cssText;
				var lines = editor.updateSelectedLine(pNodeStyle);
				
				editor.saveAndFocus();
				editor.updateNodesInLines(lines,spanNodeStyle);
				dropHelper.openAndClose(data.menu);//menu창 닫고,열고. 기본동작임.
			} else {
				dropHelper.openAndClose(data.menu);//menu창 닫고,열고. 기본동작임.
			};
			
			
			//전파종료.
			eventHelper.stop(event);
		}
		
	};
});
