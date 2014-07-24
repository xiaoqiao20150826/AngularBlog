/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var Q = require('q')
  , _ = require('underscore');
var H = require('../common/helper.js')
  , fsHelper = require('../common/fsHelper.js')
  , config = require('../config.js');

var Answer = require('../domain/Answer.js')
  , User = require('../domain/User.js')

var answerDAO = require('../dao/answerDAO.js')
  , userDAO = require('../dao/userDAO.js');


/* define  */
var answerService = module.exports = {};

/* functions */

//answerNum에 해당하는 블로그 데이터를 가져온다.
answerService.getRealAnswers = function (done, postNum) {
	var dataFn = done.getDataFn()
	, errFn = done.getErrFn();
	
	var _answers, _lowAnswers;
	
	return H.call4promise(answerDAO.findByPostNum, postNum)
	 		.then(function (answers) {
	 			_answers = answers;
	 			var answerNums = Answer.getAnswerNums(answers);
	 			var deep = 2;
	 			return H.call4promise(answerDAO.findByAnswerNums, answerNums, deep);
	 		})
	 		.then(function (lowAnswers) {
	 			_lowAnswers = lowAnswers;
	 			var userIds = _.union(Answer.getUserIds(_answers)
	 			            		, Answer.getUserIds(_lowAnswers) );
	 			
	 	    	return H.call4promise([userDAO.findByIds], userIds);
	 		})
			 .then(function (users) {
				 Answer.setUserByReal(_answers, users);
				 Answer.setUserByReal(_lowAnswers, users);
				 
				 Answer.setAnswersByReal(_answers, _lowAnswers)
				 dataFn(_answers);
			})
	 		.catch(errFn);
}

answerService.insertAnswerWithIncresedDeep = function(done, answerData) {
	var answer = Answer.createBy(answerData);
	answer.deep = answer.deep+1;
	console.log(answer);
	answerDAO.insertOne(done, answer);
};
answerService.insertAnswer = function(done, answerData) {
	var answer = Answer.createBy(answerData);
	answerDAO.insertOne(done, answer);
};
//answerService.insertanswerWithFile = function(done, answerData, file) {
//	var dataFn = done.getDataFn()
//	  , errFn = done.getErrFn();
//	
//	var answer = answer.createBy(answerData);
//	
//	var promise = null;
//	if(_existFile(file)) {
//		var urls = _getToAndFromUrls(file, config.imgDir);
//		promise = H.call4promise(fsHelper.copyNoDuplicate, urls.from , urls.to)
//				   .then(function(savedFileUrl) {
//					   answer.addFilePath(savedFileUrl);
//				    })
//				   .catch(errFn);
//	};
//	
//	// 이 구조. 다시 나오면 고민좀 해봐야겠다.
//	nextFn(promise);
//	
//	function nextFn(promise) {
//		if(promise == null) __fn();
//		else promise.then(__fn);
//		
//		function __fn() {
//			H.call4promise(answerDAO.insertOne ,answer)
//			 .then(dataFn).catch(errFn);
//		}
//	}
//}
//answerService.deleteanswerAndFile = function (done, answerNum, filepath) {
//	var dataFn = done.getDataFn()
//	  , errFn = done.getErrFn();
//	
//	H.call4promise(answerDAO.removeByanswerNum, answerNum)
//	 .then(function() {
//		 if(filepath) 
//			 return H.call4promise(fsHelper.delete, filepath) 
//		 else
//			 return;
//	 })
//	 .then(function() {
//		 dataFn();
//	 })
//	 .catch(errFn);
//}
//
////기능(나중에 옮길지도)
//function _getToAndFromUrls(fromFile, imgDir) {
//	var fileName = fromFile.name
//	  , fromFileUrl = fromFile.path //임시저장된 파일위치
//	  , toFileUrl = imgDir + '\\' + fileName;
//	  
//	return {to : toFileUrl, from : fromFileUrl };
//}
//function _existFile(file) {
//	if(file.size != 0 )
//		return true;
//	else
//		return false;
//} 