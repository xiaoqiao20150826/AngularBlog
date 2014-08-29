
/* 초기화 및 클래스 변수 */
var debug = require('debug')('route:answer')

var _ = require('underscore')
  , H = require('../../common/helper.js')
  , Done = H.Done
  
var Answer = require('../../domain/blogBoard/Answer.js')
  , answerService = require('../../service/blogBoard/answerService.js')
  , requestParser = require('../util/requestParser.js')
  , Redirector = require('../util/Redirector.js')

var answerController = module.exports = {}
answerController.mapUrlToResponse = function(app) {
		app.post('/blogBoard/answer/insert', this.insertAnswer);
		
		app.get('/blogBoard/answer/delete', this.delete);
		
}	
answerController.insertAnswer = function(req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , postNum = Number(rawData.postNum) //주의
	  , answer = Answer.createBy(rawData)
	  
	if(loginUser.isNotExist()) {//익명사용자일경우
		if(answer.isNotExistPassword()) return res.send('annoymous user should have password');
	}  
	
	debug('answer to insert : ',answer)
	H.call4promise(answerService.insertAnswerAndIncreasePostCount, answer)
	 .then(function (insertedAnswer) {
		 return H.call4promise(answerService.getJoinedAnswers, postNum) 
	 })
	 .then(function (answers) {
		var blog = { 'loginUser' : loginUser
				   , 'answers' : answers
				   , 'postNum' : postNum
				   }
		
		res.render('./centerFrame/blogBoard/answer/list.ejs', {blog: blog} )
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
