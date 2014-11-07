/**
 * 
 */

/**
 * TODO:BackgroundColor�� ���� ����. �ߺ��� ���� �����?
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

			style = style.replace("background-color", "color"); //�̺κи��ٸ���..
			
			if (dropHelper.isTitleNode(target)) {// titleŬ����
				editor.updateSelectedNodes(style);
				editor.saveAndFocus();
			} else {// title�ƴ� ��ưŬ��.
				dropHelper.openAndClose(data.menu);// ���ų� ����.
				
				if (dropHelper.isItemNode(target)) { // �����޴����� ���ĵǾ������.
					editor.updateSelectedNodes(style);
					dropHelper.updateBtnTitle(data.self, style);
					editor.saveAndFocus();
				}
			}
			// ��������.
			eventHelper.stop(event);
		}
	};
});
