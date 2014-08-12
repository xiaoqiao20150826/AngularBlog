/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var Q = require('q')
  , _ = require('underscore')
  , debug = require('debug')('service:answerService');

var H = require('../common/helper.js')
  , config = require('../config.js');

var Answer = require('../domain/Answer.js')
  , User = require('../domain/User.js')
  , ReferenceJoiner = require('../domain/ReferenceJoiner.js')

var answerDAO = require('../dao/answerDAO.js')
  , postDAO = require('../dao/postDAO.js')
  , userDAO = require('../dao/userDAO.js');


/* define  */
var answerService = module.exports = {};

/* functions */

//answerNum에 해당하는 블로그 데이터를 가져온다.
//이걸 재귀, emptyAnswer깊이, joiner의 변경. 세가지를 하면 좀더 간단해질텐데.
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
			     var _answersJoiner = new ReferenceJoiner(_answers, 'userId', 'user')
			       , joinedAnswerByUser = _answersJoiner.join(users, '_id');
			     debug('joinedAnswerByUser :',joinedAnswerByUser)
			     var _lowAnswersJoiner = new ReferenceJoiner(_lowAnswers, 'userId', 'user')
			       , joinedLowAnswersByUser = _lowAnswersJoiner.join(users, '_id');
			     debug('joinedLowAnswersByUser :',joinedLowAnswersByUser)
			     
			     //거꾸로해야해. 자식이 부모를 찾는것.
			     var answerJoiner = new ReferenceJoiner(joinedAnswerByUser, 'num', 'answers')
			       , joinedAnswersByLowAnswers = answerJoiner.joinMany(joinedLowAnswersByUser, 'answerNum');
			     
			     debug('joinedAnswers :',joinedAnswersByLowAnswers)
			     debug('joinedAnswers.answers :',joinedAnswersByLowAnswers.answers)
				 dataFn(joinedAnswersByLowAnswers);
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
	
	debug('insertAndIncreaseCount : ', answer)
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
