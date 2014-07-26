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
answerService.getJoinedAnswers = function (done, postNum) {
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

answerService.insertAnswer = function(done, answer) {
	
	answerDAO.insertOne(done, answer);
};
answerService.deleteAnswer = function(done, num) {
	answerDAO.removeAllOfNum(done, num);
}
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