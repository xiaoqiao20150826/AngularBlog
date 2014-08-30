
/* 초기화 및 클래스 변수 */
var debug = require('debug')('route:answer')

var _ = require('underscore')
  , H = require('../../common/helper.js')
  , Done = H.Done
var scriptletUtil = require('../../common/util/scriptletUtil.js')  
  
var Answer = require('../../domain/blogBoard/Answer.js')
  , answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , answerService = require('../../service/blogBoard/answerService.js')
  , requestParser = require('../util/requestParser.js')
  , Redirector = require('../util/Redirector.js')

var answerController = module.exports = {}
answerController.mapUrlToResponse = function(app) {
		app.post('/blogBoard/answer/insert', this.insertAnswer);
		app.post('/blogBoard/answer/update', this.updateAnswer);
		
		app.post('/blogBoard/answer/updateView', this.sendUpdateView);
		app.get('/blogBoard/answer/delete', this.delete);
		
}	
answerController.insertAnswer = function(req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , postNum = Number(rawData.postNum) //주의
	  , answer = Answer.createBy(rawData)
	  
	if(loginUser.isAnnoymous() ) {//익명사용자일경우 answer는 필수데이터 가져야해.
		if(answer.hasNotData4annoymous()) return res.send('annoymous user should have password and writer');
	}  
	
	debug('answer to insert : ',answer)
	H.call4promise(answerService.insertAnswerAndIncreasePostCount, answer)
	 .then(function (insertedAnswer) {
		 return H.call4promise(answerService.getRootOfAnswerTree, postNum) 
	 })
	 .then(function (rootOfAnswerTree) {
		var answers = rootOfAnswerTree.answers 
		 
		var blog = { 'loginUser' : loginUser
				   , 'answers' : answers
				   , 'postNum' : postNum
				   , 'scriptletUtil' : scriptletUtil
				   }
		
		res.render('./centerFrame/blogBoard/answer/list.ejs', {blog: blog} )
	 })
	 .catch(redirector.catch)
}
answerController.updateAnswer = function(req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	, rawData = requestParser.getRawData(req)
	, userId = rawData.userId
	, postNum = Number(rawData.postNum) //주의
	, answer = Answer.createBy(rawData)
	
	if(loginUser.isAnnoymous() ) {//익명사용자일경우 answer는 필수데이터 가져야해.
		if(answer.hasNotData4annoymous()) return res.send('error : annoymous user should have password and writer');
	} else {
		if(loginUser.isNotEqualById(userId) ) return res.send('error : loginUser should same wirter')
	}  
	
	debug('answer to update : ',answer)
	H.call4promise(answerService.updateAnswer, answer)
	.then(function (status) {
		if(status.isError()) {
			res.send(status.getMessage())
			return null;
		} else {
			return H.call4promise(answerService.getRootOfAnswerTree, postNum)
		}
	})
	.then(function (rootOfAnswerTree) {
		if(!rootOfAnswerTree) return;
		
		var answers = rootOfAnswerTree.answers 
		var blog = { 'loginUser' : loginUser
				, 'answers' : answers
				, 'postNum' : postNum
				, 'scriptletUtil' : scriptletUtil
		}
		res.render('./centerFrame/blogBoard/answer/list.ejs', {blog: blog} )
	})
	.catch(redirector.catch)
}

answerController.sendUpdateView = function (req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , currentAnswerNum = Number(rawData.currentAnswerNum) //주의
	  
    H.call4promise(answerService.getJoinedAnswer, currentAnswerNum)
     .then(function (answer) {
 		var blog = { 'loginUser' : loginUser
				   , 'answer' : answer
				   , 'postNum' : answer.postNum
				   }
		res.render('./centerFrame/blogBoard/answer/update.ejs', {blog: blog} )
	 })
     .catch(redirector.catch)	
     
}

answerController.delete = function(req, res) {
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , userId = rawData.userId
	  , num = rawData.num;
//	if(loginUser.isNotEqualById(writer)) return redirector.post(postNum)	
	if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectCurrentPost(rawData, res);
	
	answerService.deleteAnswer(new Done(dataFn, catch1(res)), num); 
	function dataFn() {
		_redirectCurrentPost(rawData, res)
	}
}
