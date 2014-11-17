
/***
 * TODO: [error] 인서트폼. 가져올때 "현재 클릭된" 인서트폼을 구분하지 않았다.
 *       그렇기에 올바르게 onSubmit이 등록되지 않았다. 기본동작을 하게되버렸어.
 *       
 */

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
		  , $insertViewBtns = answerView.get$insertViewBtns()
		  , $updateViewBtns = answerView.get$updateViewBtns()
		  , $deleteBtns = answerView.get$deleteBtns()
		
		app.onSubmit($insertForm, this.ajaxToInsertAnswerBy1(answerView))
		app.onClick($insertViewBtns, this.showInsertView1(answerView))
		app.onClick($updateViewBtns, this.showUpdateView1(answerView))
		app.onClick($deleteBtns, this.deleteAnswer1(answerView) )
	}
	//update, insert의 공통기능 체크하고 ajax요청 후  reRendering
	AnswerController.prototype.ajaxToInsertAnswerBy1 = function (answerView) {
		var reStarter = this.app.getReStarter()
		
		return function (e) {
			
			var $insertForm = answerView.get$insertForm()
			  , url = $insertForm.attr('action')
			var formMap = H.formDataToMap($insertForm)  
			  , password = formMap.password
			  , writer = formMap.writer
			  
			if(_isAnnoymous(writer) ) {
				if(H.notExist(writer)) return H.errorWarning(e,'writer should not empty')
				if(H.notExist(password)) return H.errorWarning(e,'password should not empty')
			}
			if(H.notExist(formMap.content) ) return H.errorWarning(e,'content should not empty')  
			
			ajax.call(callback, url, formMap)
			function callback (html) {
				if(_isErrorByMessage(html)) { return alert(html); } 
				
				divUtil.replaceAnswerDiv(html)
			    reStarter.answerOfBlogBoard()
			}
			
			return e.preventDefault(); 
		}
	}
	
	//누구에게 무엇을 어디에 어떻게
	AnswerController.prototype.showInsertView1= function (answerView) {
		var self = this
		var app = this.app
		  , reStarter = app.getReStarter()
		return function (e) {
			var $insertViewBtn = $(this)
			  , currentNum = $insertViewBtn.data().currentnum 
			  , insertViewHtml = answerView.getInsertViewDivHtml()
			  , $currentDiv4InsertView = answerView.find$currentDiv4InsertView($insertViewBtn)
			  , cancelFn = self.cancel1($currentDiv4InsertView)
			  
			if($currentDiv4InsertView.html() ) { return cancelFn(e) }
			
			//else 인서트뷰 대입하고 대한 정보삽입.
			$currentDiv4InsertView.html(insertViewHtml);
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
	
	AnswerController.prototype.deleteAnswer1 = function (answerView) {
		  var reStarter = this.app.getReStarter()		
		return function (e) {
			var $deleteBtn = $(this)
			  , ds = $deleteBtn.data()
			  , writer = ds.writer
			  , data = { num: ds.currentnum
				       , userId: ds.userid
				       , writer: ds.writer
				       , postNum: ds.postnum
				       , includedNums : ds.includednums
				       }
			
			var yes = confirm("Do you realy want to delete reply?");
			if(!yes) return e.preventDefault();
			
			if(_isAnnoymous(writer)) {data.password = prompt('input password')}
			
			ajax.call(dataFn, '/blogBoard/answer/delete', data)  
			function dataFn (html) {
				if(_isErrorByMessage(html)) { return alert(html); } 
				
				divUtil.replaceAnswerDiv(html)
			    reStarter.answerOfBlogBoard()
			}
			return e.preventDefault();
		}
	}
	
	
	//공통기능
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
	
	//helper
//	서버에서 html대신 에러메시지를 받을 경우.
	function _isErrorByMessage(html) {
		var message = html.slice(0,10)
		if(message.indexOf('error') != -1) return true;
		else return false;
	}
	//writer가 있는지 유무로 판단.
	function _isAnnoymous(writer) {
		if( !(writer == undefined || writer == "") ) return true;
		else return false;
	}
	
});

//@ sourceURL=/controller/AnswerController.js