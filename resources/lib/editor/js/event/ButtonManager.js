/**
 * 거창한 이름과는 달리 이벤트 + 노드 합쳐서 버튼으로 초기화시켜주는 역할만함.
 * 키리스너가 포함되었으니 버튼매니저란 이름이 틀리지..
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
		//이벤트 객체를 가져오고.
		for(var i in eventBtns) {
			var eventedNode = eventBtns[i];
			if(eventedNode['init']) {
				eventedNode['init'](editor);
			};
		};
	};
	
});