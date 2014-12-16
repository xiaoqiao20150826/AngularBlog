
/* 초기화 및 클래스 변수 */
var debug = require('debug')('nodeblog:controller:answer')

var _ = require('underscore')
  , Q = require('q')
  , H = require('../../common/helper.js')

var JsonResponse = require('../util/JsonResponse.js')
  , AuthRequest  = require('../util/AuthRequest.js')
  
var Answer = require('../../domain/blogBoard/Answer.js')
  , answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , answerService = require('../../service/blogBoard/answerService.js')

var answerController = module.exports = {}
answerController.mapUrlToResponse = function(app) {
		app.get('/json/blogBoard/answer/list', this.sendRootOfAnswer)
		
		app.post('/json/blogBoard/answer/insert', this.insertAnswer)
		app.post('/json/blogBoard/answer/update', this.updateAnswer);
		app.post('/json/blogBoard/answer/delete', this.deleteAnswer);
}	


answerController.sendRootOfAnswer = function(req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var rawData 	= authReq.getRawData()
	  , postNum     = Number(rawData.postNum) //주의
	debug('answer-rootOfAnswer rawData : ',rawData)
	
	if(H.notExist(postNum)) return jsonRes.sendFail('not exist postNum for answer list ')
	
	answerService.getRootOfAnswerTree(postNum)
				 .then(function(rootOfAnswerTree) {
//					 if(rootOfAnswerTree._id == null) rootOfAnswerTree = []; //빈거보내.
					 
					 return jsonRes.send(rootOfAnswerTree)
				 })
				 .catch(jsonRes.catch())
}
answerController.insertAnswer = function(req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var loginUser   = authReq.getLoginUser()
	var rawData 	= authReq.getRawData()
	  , postNum     = Number(rawData.postNum) //주의
	  , answer 		= Answer.createBy(rawData)
	
	 debug('answer-insert rawData : ',rawData)
	 
	if(H.notExist(postNum)) return jsonRes.sendFail('not exist postNum for answer list ')  
	  
	if(answer.isAnnoymous() ) {//작성자가 answer는 필수데이터 가져야해.
		if(answer.hasNotData4annoymous()) return jsonRes.sendFail('annoymous user should have password and writer');
	} else {
		if(loginUser.isNotEqualById(answer.userId)) return jsonRes.sendFail(answer.userId + ' is not loginUser')
	}  
	
	
	answerService.insertAnswerAndIncreasePostCount(answer)
				 .then(function (insertedAnswer) {
					 return jsonRes.send(insertedAnswer) 
				 })
				 .catch(jsonRes.catch());
}

answerController.updateAnswer = function(req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var loginUser   = authReq.getLoginUser()
	var rawData 	= authReq.getRawData()
   	  , postNum 	= Number(rawData.postNum) //주의
	  , answer 		= Answer.createBy(rawData)

	 debug('answer-update rawData : ',rawData)
	 
	if(H.notExist(postNum)) return jsonRes.sendFail('not exist postNum for answer list ')  
	if(answer.isAnnoymous() ) {//작성자가 answer는 필수데이터 가져야해.
		if(answer.hasNotData4annoymous()) return jsonRes.sendFail('annoymous user should have password and writer');
	} else {
		if(loginUser.isNotEqualById(answer.userId)) return jsonRes.sendFail(userId + ' is not loginUser')
	}   
	
	
	answerService.updateAnswer(answer)
				 .then(function (status) {
					if(status.isError && status.isError()) return jsonRes.sendFail(status)
					else return jsonRes.send(status.message)
				 })
				 .catch(jsonRes.catch())
}

// 자식이 없으면 지우고. 아니면 지운 표시만.(업데이트)
answerController.deleteAnswer = function(req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var loginUser   = authReq.getLoginUser()
	var rawData 	= authReq.getRawData()
 	  , postNum 	= Number(rawData.postNum) //주의
	  , answer 		= Answer.createBy(rawData);
	  
	 debug('answer-delete rawData : ',rawData)
	 
	if(H.notExist(postNum)) return jsonRes.sendFail('not exist postNum for answer list ')  
	if(answer.isAnnoymous() ) {//작성자가 answer는 필수데이터 가져야해.
		if(answer.hasNotData4annoymous()) return jsonRes.sendFail('annoymous user should have password and writer');
	} else { // loginsUser일경우.
		if(loginUser.isNotEqualById(answer.userId)) return jsonRes.sendFail(answer.userId + ' is not loginUser')
	}
	
	answerService.deleteAnswer(answer) 
				 .then(function (status) {
					if(status.isError && status.isError()) return jsonRes.sendFail(status)
					else return jsonRes.send(status.message)
				 })
				 .catch(jsonRes.catch())
}
