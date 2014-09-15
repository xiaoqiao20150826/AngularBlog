/**
 * 
 */
$$namespace.include(function (require, module) {
	var	ID = "#fontSize";
	
	var dropHelper = require('/event/dropHelper')
	  , eventHelper = require('/event/eventHelper')
	
	var fontSize = module.exports = {
		init : function(editor) {
			this._editor = editor;
			this._btnNode = editor.getEditorElementById(ID);
			this._menuNode = dropHelper.getMenuElement(this._btnNode);
			
			this.appendItems(this._btnNode, this._menuNode);
			var eventType = eventHelper.EVENT.click;
			this.addAction(eventType);
		},

		appendItems : function(drop, menu) {
			var frag = document.createDocumentFragment();
			var beforeStr = "font-size:", afterStr = "pt;", 
				textContent = "ABCD";
			for (var i = 1; i < 46; ++i) {
				if (i % 3 == 0) {
					var styleStr = beforeStr + i + afterStr,
						item = dropHelper.createItemNode(textContent, styleStr);
					frag.appendChild(item);
				}
			}
			menu.appendChild(frag);
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
				var style = target.style.cssText;
				editor.updateSelectedNodes(style);
				editor.saveAndFocus();
			};
			//menu창 닫고,열고. 기본동작임.
			dropHelper.openAndClose(data.menu);
			//전파종료.
			eventHelper.stop(event);
		}
		
	};
});
