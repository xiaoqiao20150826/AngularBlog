/**
 * ��â�� �̸����� �޸� �̺�Ʈ + ��� ���ļ� ��ư���� �ʱ�ȭ�����ִ� ���Ҹ���.
 * Ű�����ʰ� ���ԵǾ����� ��ư�Ŵ����� �̸��� Ʋ����..
 */

$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var eventBtns = [
	                  require('button/basic')
	                , require('button/backgroundColor')
	                , require('button/fontSize')
	                , require('button/fontColor')
	                , require('button/undoRedo')
	                , require('button/inOutdent')
	                , require('button/lineHeight')
	                , require('button/lineStyle')
	                , require('button/image')
	                  
	                , require('content/imageListener')
	                , require('content/keyListner')
	                ];
	
	var ButtonManager = module.exports = function ButtonManager(editor) {
		//default field
		this._editor = editor;
	};
	ButtonManager.prototype.assignEvent = function () {
		var editor = this._editor
		//�̺�Ʈ ��ü�� ��������.
		for(var i in eventBtns) {
			var eventedNode = eventBtns[i];
			if(eventedNode['init']) {
				eventedNode['init'](editor);
			};
		};
	};
	
});