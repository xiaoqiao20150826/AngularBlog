
$$namespace.include(function(require, module) {
	var H = require('/util/helper') 
	  , ajax = require('/util/ajax') 
	  , divUtil = require('/util/divUtil') 

	var actionHistory = require('history/actionHistory')
	  , Action = require('history/Action') 

	var AnswerController = module.exports = function (app) {
		var viewManager = app.getViewManager()
		  , answerView = viewManager.getAnswerView()
		  
		this.app = app;
		this.answerView = answerView
	}
	
	AnswerController.prototype.onHandler = function () {
		var app = this.app
		  , answerView = this.answerView
		  , $insertForm = answerView.get$insertForm()
		  , $replyViewBtns = answerView.get$replyViewBtns()
		  , $updateViewBtns = answerView.get$updateViewBtns()
		
		app.onSubmit($insertForm, this.checkInsertAnswer1(answerView))
		app.onClick($replyViewBtns, this.showInsertView1(answerView))
		app.onClick($updateViewBtns, this.showUpdateView1(answerView))
	}
	
	//update도 이걸로.
	AnswerController.prototype.checkInsertAnswer1 = function (answerView) {
		var reStarter = this.app.getReStarter()
		
		return function (e) {
			var $insertForm = answerView.get$insertForm()
			  , url = $insertForm.attr('action')
			var queryString = decodeURI($insertForm.serialize())
			  , queryMap = H.queryStringToMap(queryString)
			  , password = queryMap.password
			  , writer = queryMap.writer
			  
			if(_isAnnoymous(writer) ) {
				if(H.notExist(writer)) return H.errorWarning(e,'writer should not empty')
				if(H.notExist(password)) return H.errorWarning(e,'password should not empty')
			}
			if(H.notExist(queryMap.content) ) return H.errorWarning(e,'content should not empty')  
			
			ajax.call(callback, url, queryMap)
			function callback (html) {
				if(_isErrMessage(html)) { return alert(html); } 
				
				divUtil.replaceAnswerDiv(html)
			    reStarter.answerOfBlogBoard()
			}
			return e.preventDefault(); 
		}
		//단순히 password값 유무로 판단. 노드가 있을경우 기본값이 ''
	}
	function _isAnnoymous(writer) {
		if(writer != undefined) return true;
		else return false;
	}
	function _isErrMessage(html) {
		var message = html.slice(0,10)
		if(message.indexOf('error') != -1) return true;
		else return false;
	}
	
	//누구에게 무엇을 어디에 어떻게
	AnswerController.prototype.showInsertView1= function (answerView) {
		var self = this
		var app = this.app
		  , reStarter = app.getReStarter()
		return function (e) {
			var $replyViewBtn = $(this)
			  , currentNum = $replyViewBtn.data().currentnum 
			  , insertDivHtml = answerView.getInsertDivHtml()
			  , $currentDiv4InsertView = answerView.find$currentDiv4InsertView($replyViewBtn)
			  , cancelFn = self.cancel1($currentDiv4InsertView)
			  
			if($currentDiv4InsertView.html() ) { return cancelFn(e) }
			
			//else 인서트뷰 대입하고 대한 정보삽입.
			$currentDiv4InsertView.html(insertDivHtml);
			var $input4answerNum = answerView.find$input4answerNum($currentDiv4InsertView)
			$input4answerNum.val(currentNum)
			reStarter.answerOfBlogBoard()
			
			var $currentCancelBtn = answerView.find$currentCancelBtn($currentDiv4InsertView)
			//cancel
			$currentCancelBtn.show()
			app.onClick($currentCancelBtn, cancelFn)
			
			return e.preventDefault();
		}
	}
	
	AnswerController.prototype.showUpdateView1= function (answerView) {
		var self = this
		var app = this.app
		  , reStarter = app.getReStarter()
		return function (e) {
			var $updateViewBtn = $(this)
			  , currentNum = $updateViewBtn.data().currentnum 
			  , data = {currentAnswerNum : currentNum}
			  , $currentRowDiv = answerView.find$currentRowDiv(currentNum)
			  
			self._tempRowHtml = $currentRowDiv.html()
			  
			ajax.call(dataFn, '/blogBoard/answer/updateView', data)  
			function dataFn (html) {
				$currentRowDiv.html(html)
				reStarter.answerOfBlogBoard()
				
				var $cancelBtn = answerView.find$currentCancelBtn($currentRowDiv)
				app.onClick($cancelBtn, self.cancel1($currentRowDiv) )
			}
			return e.preventDefault();
		}
	}
	
	//
	AnswerController.prototype._tempRowHtml = '';
	AnswerController.prototype.cancel1 = function ($div) {
		var self = this
		var app = this.app
		  , reStarter = app.getReStarter()
		  
		return function _updateCancel (e) {
			$div.html(self._tempRowHtml)
			reStarter.answerOfBlogBoard()
			
			self._tempRowHtml = ''
			return e.preventDefault();
		}
	}
	
});

//@ sourceURL=/controller/AnswerController.js