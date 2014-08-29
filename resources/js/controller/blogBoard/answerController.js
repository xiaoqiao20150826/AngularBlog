
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
		  , $loginBtn = answerView.get$loginBtn()
		
		app.onSubmit($insertForm, this.insertAnswer1(answerView))

	}
	AnswerController.prototype.insertAnswer1 = function (answerView) {
		var reStarter = this.app.getReStarter()
		
		return function (e) {
			var $insertForm = answerView.get$insertForm()
			var queryString = decodeURI($insertForm.serialize())
			  , queryMap = H.queryStringToMap(queryString)
			  , password = queryMap.password;
			  
			if(_isNotLogIn(password) ) {
				if(H.notExist(queryMap.userId)) return H.errorWarning(e,'writer should not empty')
				if(H.notExist(password)) return H.errorWarning(e,'password should not empty')
			}
			if(H.notExist(queryMap.content) ) return H.errorWarning(e,'content should not empty')  
			
			ajax.call(callback, '/blogBoard/answer/insert', queryMap)
			function callback (html) {
				divUtil.replaceAnswerDiv(html)
			    reStarter.answerOfBlogBoard()
			}
			return e.preventDefault(); 
		}
	}

	//단순히 password값 유무로 판단. 노드가 있을경우 기본값이 ''
	function _isNotLogIn(password) {
		if(password != undefined) return true;
		else return false;
	}
});

//@ sourceURL=/controller/AnswerController.js