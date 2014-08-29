/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var _ = require('underscore')
  , debug = require('debug')('nodeblog:service:answerService');

var H = require('../../common/helper.js')
  , config = require('../../config.js');

var Answer = require('../../domain/blogBoard/Answer.js')
  , User = require('../../domain/User.js')
  , Joiner = require('../../dao/util/Joiner.js')

var answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , postDAO = require('../../dao/blogBoard/postDAO.js')
  , userDAO = require('../../dao/userDAO.js');


/* define  */
var answerService = module.exports = {};

/* functions */

//postNum의 answer를 가져와서 트리형태로 만든다.
//이때 루트는 num 이 null 인 answer
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
				 var rootOfTree = answersJoinUsersAndTreeAnswers(users, _answers)
			     return dataFn(rootOfTree.answers);
			})
	 		.catch(errFn);
}
// 조인한 후, 트리화 시킨다.
function answersJoinUsersAndTreeAnswers (users, answers) {
	//user가 있거나, id에 해당하는 유저가 없다면. 익명유저이어라. 
    var userJoiner = new Joiner(users, '_id', 'user')
      , joinedAnswerByUser = userJoiner.joinTo(answers, 'userId', function (_answer) {
    	  var user = User.getAnnoymousUser()
    	  user.name = _answer.userId
    	  return user;
      });
    
    var answerJoiner = new Joiner(joinedAnswerByUser, 'answerNum', 'answers')
      , rootOfTree = answerJoiner.treeTo(Answer.makeRoot(), 'num');
    
    debug('rootOfAnswersTree :', rootOfTree)
    
    return rootOfTree;
}



answerService.insertAnswerAndIncreasePostCount = function(done, answer) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	var postNum = answer.postNum;
	
	H.all4promise([  
	                 [answerDAO.insertOne, answer]
	              ,  [postDAO.increaseAnswerCount, postNum]
				 ])
				 .then(function(args){
				 	 var insertedAnswer = args[0];
				   	 return dataFn(insertedAnswer);
				 })
				 .catch(errFn);
};
answerService.deleteAnswer = function(done, answerNum) {
	answerDAO.removeAllOfNum(done, answerNum);
}
