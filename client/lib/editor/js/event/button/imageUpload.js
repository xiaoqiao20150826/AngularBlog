/**
 * 
 */

/**
 * 
 */
$$namespace.include(function (require, module) {
	var	BTN_ID = "#imageUpload",
		FILE_NODE_ID = "#nodeOfInputFile";
	var eventHelper = require('event/eventHelper')

	var imageUpload = module.exports = {}
	imageUpload.init = function(editor) {
		this._editor = editor;
		this._imageButton = editor.getEditorElementById(BTN_ID);
		this._nodeOfInputFile = editor.getEditorElementById(FILE_NODE_ID);
		
		this.addAction(eventHelper.EVENT.click);
	}
			
	imageUpload.addAction = function(eventType) {
		var editor = this._editor
		var	imageButton = this._imageButton
		  , nodeOfInputFile = this._nodeOfInputFile
		  , useCapture = false
		
		imageButton.addEventListener(eventType, _dispatchFileCallBack1(editor, nodeOfInputFile), useCapture);
		nodeOfInputFile.addEventListener("change", _uploadCallBack1(editor), useCapture); //업로드할 파일 선택완료하면 콜백호출됨
	}
	function _dispatchFileCallBack1(editor, nodeOfInputFile) {
		return function _dispatchFileCallBack(e) {
			var dispatchEvent = document.createEvent("MouseEvents");
			dispatchEvent.initEvent("click", false, true);
			nodeOfInputFile.dispatchEvent(dispatchEvent);	

			eventHelper.stop(e);			
		}
	}
	
	function _uploadCallBack1(editor) {
		var imageUploadMethod = editor.getImageUploadCallback()
		return function _uploadCallBack(e) {
			//this가 fileElement
			imageUploadMethod.call(this, e, this, editor)
			
			return eventHelper.stop(e);
		}
	}
});
