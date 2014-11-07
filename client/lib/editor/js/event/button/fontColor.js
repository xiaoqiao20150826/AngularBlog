/**
 * 
 */

/**
 * TODO:BackgroundColor과 거의 같다. 중복을 없엘 방법은?
 */
$$namespace.include(function (require, module) {
	var ID = "#fontColor";

	var dropHelper = require('/event/dropHelper')
	  , eventHelper = require('/event/eventHelper')
	
	var fontColor = module.exports = {
		init : function(editor) {
			this._editor = editor;
			this._btnNode = editor.getEditorElementById(ID);
			this._menuNode = dropHelper.getMenuElement(this._btnNode);
			
			var eventType = eventHelper.EVENT.click;
			this.addAction(eventType);
		},

		addAction : function(eventType) {
			var btnNode = this._btnNode, 
				data = {self : btnNode,	menu : this._menuNode},
				bindedCallBack = this.callBack.bind(this, data),
				useCapture = false;

			btnNode.addEventListener(eventType, bindedCallBack, useCapture);
		},
		callBack : function(data, e) {
			var event = e || window.evnet,
				target = e.target || e.srcElement,
				style = target.style.cssText,
				editor = this._editor;

			style = style.replace("background-color", "color"); //이부분만다른데..
			
			if (dropHelper.isTitleNode(target)) {// title클릭시
				editor.updateSelectedNodes(style);
				editor.saveAndFocus();
			} else {// title아닌 버튼클릭.
				dropHelper.openAndClose(data.menu);// 열거나 닫음.
				
				if (dropHelper.isItemNode(target)) { // 하위메뉴에서 전파되었을경우.
					editor.updateSelectedNodes(style);
					dropHelper.updateBtnTitle(data.self, style);
					editor.saveAndFocus();
				}
			}
			// 전파종료.
			eventHelper.stop(event);
		}
	};
});
