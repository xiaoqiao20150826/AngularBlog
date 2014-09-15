/**
 * 
 */

/**
 * 
 */
$$namespace.include(function (require, module) {
	var	$ = jQuery,
		BTN_ID = "#imageUpload",
		FILE_NODE_ID = "#nodeOfInputFile";

	var eventHelper = require('/event/eventHelper')
	
	var image = module.exports = {
			init : function(editor) {
				this._editor = editor;
				this._imageButton = editor.getEditorElementById(BTN_ID);
				this._nodeOfInputFile = editor.getEditorElementById(FILE_NODE_ID);
				
				var eventType = eventHelper.EVENT.click;
				this.addAction(eventType);
			},
			
			addAction : function(eventType) {
				var	imageButton = this._imageButton,
					nodeOfInputFile = this._nodeOfInputFile,
					useCapture = false;
				
				var	data = {nodeOfInputFile:nodeOfInputFile},
					dispatchBindedCallBack = this._dispatchFileCallBack.bind(this, data),
					uploadBindedCallBack = this._uploadCallBack.bind(this, data);
				imageButton.addEventListener(eventType, dispatchBindedCallBack, useCapture);
				nodeOfInputFile.addEventListener("change", uploadBindedCallBack, useCapture); //업로드할 파일 선택완료하면 콜백호출됨
			},
			_dispatchFileCallBack : function(data, e) {
				var event =e || window.event,
					nodeOfInputFile = data.nodeOfInputFile;
				//1. input 클릭
				var dispatchEvent = document.createEvent("MouseEvents");
				dispatchEvent.initEvent("click", false, true);
				nodeOfInputFile.dispatchEvent(dispatchEvent);	

				eventHelper.stop(event);
			},
			_uploadCallBack : function (data, e) {
				var event =e || window.event,
					nodeOfInputFile = data.nodeOfInputFile;
				
				var formData = new FormData();
				formData.append('imageFile', nodeOfInputFile.files[0]);
				var bindedCallback = this._insertImageToTree.bind(this);
				//호출
			    $.ajax({
			        url: "/uploadImage",
			        type: 'POST',
			        data: formData,
			        processData: false,
			        contentType: false,
			        success: bindedCallback
			    });
			    
				eventHelper.stop(event);
			},
			_insertImageToTree : function(responseData) {
				var imageUrl = window.location.origin+responseData;
				var editor = this._editor;
	            var rangeManager = editor.getRangeManager(); 
	        	var range = rangeManager.getCurrentRange();			
	        	
	        	var imgNode = document.createElement("img");
	        	imgNode.setAttribute("src",imageUrl);
	        	imgNode.setAttribute("style","width:100px;");
	        	
	        	range.commonAncestorContainer.parentNode.appendChild(imgNode);
			} 
	};
});
