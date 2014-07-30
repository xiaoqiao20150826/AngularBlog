/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var Q = require('q')
  , _ = require('underscore');
var H = require('../common/helper.js')
  , config = require('../config.js');

var Answer = require('../domain/Answer.js')
  , User = require('../domain/User.js')

var answerDAO = require('../dao/answerDAO.js')
  , postDAO = require('../dao/postDAO.js')
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
//to deprease
answerService.insertAnswer = function(done, answer) {
	answerDAO.insertOne(done, answer);
};

// 주의 post의 answerCount를 증가시키는 것.
answerService.insertAndIncreaseCount = function(done, answer) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	var postNum = answer.postNum;
	
	Q.all([H.call4promise(answerDAO.insertOne, answer)
	     , H.call4promise(postDAO.increaseAnswerCount, postNum)
    ])
     .then(function(args){
    	 var insertedAnswer = _.first(args);
    	 dataFn(insertedAnswer);
     })
     .catch(errFn);
};
answerService.deleteAnswer = function(done, answerNum) {
	answerDAO.removeAllOfNum(done, answerNum);
}
