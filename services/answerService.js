/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var Q = require('q')
  , _ = require('underscore')
  , debug = require('debug')('nodeblog:service:answerService');

var H = require('../common/helper.js')
  , config = require('../config.js');

var Answer = require('../domain/Answer.js')
  , User = require('../domain/User.js')
  , Joiner = require('../domain/Joiner.js')

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
	
	var _answers;
	
	return H.call4promise(answerDAO.findByPostNum, postNum)
	 		.then(function (answers) {
	 			_answers = answers
	 			var userIds = Answer.getUserIds(_answers);
	 	    	return H.call4promise([userDAO.findByIds], userIds);
	 		})
			 .then(function (users) {
			     var userJoiner = new Joiner(users, '_id', 'user')
			       , joinedAnswerByUser = userJoiner.joinTo(_answers, 'userId');
			     var answerJoiner = new Joiner(joinedAnswerByUser, 'answerNum', 'answers')
			       , rootOfTree = answerJoiner.treeTo(Answer.makeRoot(), 'num');

				 dataFn(rootOfTree.answers);
				 
			     debug('joinedAnswerByUser :', joinedAnswerByUser)
			     debug('rootOfAnswersTree :', rootOfTree)
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
