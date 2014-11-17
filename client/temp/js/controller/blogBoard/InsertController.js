
$$namespace.include(function(require, module) {
	
	
	var H = require('/util/helper') 
	  , ajax = require('/util/ajax') 

	var actionHistory = require('history/actionHistory')
	  , Action = require('history/Action')
	//
	var InsertController = module.exports = function(app) {
		var viewManager = app.getViewManager()
		  , insertView = viewManager.getInsertView()
		  
		this.app = app;
		this.insertView = insertView
		
		app.setImageUploadCallback(this.uploadFile1(insertView))
	}
	InsertController.prototype.onHandler = function () {
		var app = this.app
		
		var insertView = this.insertView
		  , $insertForm = insertView.get$insertForm()
		
		app.onSubmit($insertForm, this.checkBeforSubmitForm1($insertForm) )
		
	}
	
	InsertController.prototype.uploadFile1 = function(insertView) {
		return function (e, editor) {
			var $btn = $(this)
			  , inputNode = this
			  , file = this.files[0]
			  , size = file.size
			  , fileName = file.name.slice(0, file.name.indexOf('.'))
			var maxByte = 2000000;
			if(size > maxByte) {
				alert('file size should be max 2MB');
				inputNode.files = null
				inputNode.value = '' 
				return e.preventDefault();
			}
			
			var formData = new FormData()
			formData.append('file', file);
			
			ajax.call4file(dataFn, '/file/upload', formData)
			function dataFn(statusJsonString) {
				var status = JSON.parse(statusJsonString)
				if(status.isError) return alert(status.message);
				
				var fileInfo = status.fileInfo
				  , fileUrl = fileInfo.url
				//decode
				fileInfo = H.decodeURI(fileInfo)
				
				editor.insertImageToContent(fileInfo.url); // content에 이미지노드 삽입
				  
				//fileInfo를 jsonString으로 변환하여 input 값으로 넣기.  
				var $fileInfoesStringInput = insertView.get$fileInfoesStringInput()
				  , $fileUrlsViewNode = insertView.get$fileUrlsViewNode()
				  , fileInfoes = $fileInfoesStringInput.val()
				
				if(fileInfoes == '') fileInfoes = '[]';
				fileInfoes = JSON.parse(fileInfoes);
				fileInfoes.push(fileInfo);
				
				$fileInfoesStringInput.val(JSON.stringify(fileInfoes));

				var text = $fileUrlsViewNode.text()
				if(text == '') {
					$fileUrlsViewNode.text(fileUrl)
				}
				else {
					$fileUrlsViewNode.text(text + '\n' + fileUrl);
				
				}
				
				// [주의] 아래코드를 추가하지 않으면 form이 파일이 추가되었기에 
				// 폼이 새롭게 구성되어 추가했던 이벤트가 무용해진다. 
				inputNode.value = '' 		
				inputNode.files = null
				
				return ;
			}
			
			return e.preventDefault();
		}
	}
	
	//서버에서 처리되도록 하자. 이건 검증만.
	InsertController.prototype.checkBeforSubmitForm1 = function ($insertForm) {
		return function (e) {
			$$editor.insertContentToTextarea();
			
			var formMap = H.formDataToMap($insertForm)
			if(H.notExist(formMap.title)) return H.errorWarning(e,'title should not empty')  
			if(H.notExist(formMap.content)) return H.errorWarning(e,'content should not empty')
			
			return ; //본래 역할 수행.
		}
	}
	
});

//@ sourceURL=/controller/InsertController.js