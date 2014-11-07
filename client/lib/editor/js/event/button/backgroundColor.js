/**
 * 
 */

/**
 * 
 */
$$namespace.include(function (require, module) {
	var	ID = "#backgroundColor";
	
	var dropHelper = require('/event/dropHelper')
	  , eventHelper = require('/event/eventHelper')
	
	var backgroundColor = module.exports = {
		init : function(editor) {
			this._editor = editor;
			this._btnNode = editor.getEditorElementById(ID);
			this._menuNode = dropHelper.getMenuElement(this._btnNode);
			
			var eventType = eventHelper.EVENT.click;
			this.addAction(eventType);
		},
		addAction : function(eventType) {
			var btnNode = this._btnNode,
				data = {self:btnNode,
						menu:this._menuNode};
				bindedCallBack = this.callBack.bind(this, data);
				useCapture = false;
				
			btnNode.addEventListener(eventType, bindedCallBack, useCapture);	
		},
		callBack : function(data, e) {
			var event =e || window.event, 
				target = e.target || e.srcElement,
				style =target.style.cssText,
				editor = this._editor;
			
			if(dropHelper.isTitleNode(target)) {//titleŬ����
				editor.updateSelectedNodes(style);
				editor.saveAndFocus();
			} else {//title�ƴ� ��ưŬ��.
				dropHelper.openAndClose(data.menu);//���ų� ����.
				
				if(dropHelper.isItemNode(target)) { //�����޴����� ���ĵǾ������.
					editor.updateSelectedNodes(style);
					editor.saveAndFocus();
					dropHelper.updateBtnTitle(data.self, style);
				};
			}
			//��������.
			eventHelper.stop(event);
		}
	};
});
