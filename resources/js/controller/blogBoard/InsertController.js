
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
		
	}
	InsertController.prototype.onHandler = function () {
		var app = this.app
		
		var insertView = this.insertView
		  , $insertFileBtn = insertView.get$insertFileBtn()
		  , $insertForm = insertView.get$insertForm()
		
		app.onChange($insertFileBtn, this.uploadFile1(insertView) )
		
		app.onSubmit($insertForm, this.checkBeforSubmitForm1($insertForm) )
		
	}
	
	InsertController.prototype.uploadFile1 = function(insertView) {
		return function (e) {
			var $btn = $(this)
			  , userId = $btn.data().userid
			  , inputNode = this
			  , file = this.files[0]
			  , size = file.size
			
			var maxByte = 2000000;
			if(size > maxByte) {
				alert('file size should be max 2MB');
				inputNode.files = null
				inputNode.value = '' 
				return e.preventDefault();
			}
			
			var formData = new FormData()
			formData.append('file', file);
			formData.append('userId', userId)
			
			ajax.call4file(dataFn, '/file/upload', formData)
			function dataFn(fileUrl) {
				if(!fileUrl) return;
				
				var $fileUrlsNode = insertView.get$fileUrlsNode()
				  , $fileListNode = insertView.get$fileListNode()
				  , value = $fileUrlsNode.val();
				
				value = value + ';' + fileUrl
				if(value.charAt(0) == ';') {value = value.slice(1)}
				
				$fileUrlsNode.val(value); 
			    $fileListNode.text(value.replace(/;/g,'\n')); 
				inputNode.files = null;
			}
			
			return e.preventDefault();
		}
	}
	
	//서버에서 처리되도록 하자. 이건 검증만.
	InsertController.prototype.checkBeforSubmitForm1 = function ($insertForm) {
		return function (e) {
			var queryString = decodeURI($insertForm.serialize())
			  , queryMap = H.queryStringToMap(queryString)
			  
			if(H.notExist(queryMap.title)) return H.errorWarning(e,'title should not empty')  
			if(H.notExist(queryMap.content)) return H.errorWarning(e,'content should not empty')  

			return ; //본래 역할 수행.
		}
	}
	
});

//@ sourceURL=/controller/InsertController.js