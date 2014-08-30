/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var _ = require('underscore')
  , debug = require('debug')('nodeblog:service:answerService')

var H = require('../../common/helper.js')
  , config = require('../../config.js')

var Answer = require('../../domain/blogBoard/Answer.js')
  , User = require('../../domain/User.js')
  , Joiner = require('../../dao/util/Joiner.js')
  , Status = require('../../dao/util/Status.js')

var answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , postDAO = require('../../dao/blogBoard/postDAO.js')
  , userDAO = require('../../dao/userDAO.js')


/* define  */
var answerService = module.exports = {};

/* functions */

//postNum의 answer를 가져와서 트리형태로 만든다.
//이때 루트는 num 이 null 인 answer
answerService.getRootOfAnswerTree = function (done, postNum) {
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
			     return dataFn(rootOfTree);
			})
	 		.catch(errFn);
}
// 조인한 후, 트리화 시킨다.
function answersJoinUsersAndTreeAnswers (users, answers) {
    var joinedAnswerByUser = answersJoinUsers(answers, users)
    var answerJoiner = new Joiner(joinedAnswerByUser, 'answerNum', 'answers')
      , rootOfTree = answerJoiner.treeTo(Answer.makeRoot(), 'num');
    
    debug('rootOfAnswersTree :', rootOfTree)
    
    return rootOfTree;
}
function answersJoinUsers(answers, users) {
	//user가 있거나, id에 해당하는 유저가 없다면. 익명유저이어라. 
    var userJoiner = new Joiner(users, '_id', 'user')
      , joinedAnswerByUser = userJoiner.joinTo(answers, 'userId', function (_answer) {
    	  var user = User.getAnnoymousUser()
    	  user.name = _answer.writer 
    	  return user;
      });
    return joinedAnswerByUser;
}
answerService.getJoinedAnswer = function (done, currentAnswerNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	var _answer = null  
    return  H.call4promise(answerDAO.findByNum, currentAnswerNum)
		     .then(function(answer) {
		    	 _answer = answer;
		    	 
		    	 if(answer.isAnnoymous()) 
		    		 return null;
		    	 else
		    		 return H.call4promise([userDAO.findById], answer.userId)
		     })
		      .then(function (user) {
		    	  if(user == null) {
		    		  user = User.getAnnoymousUser()
		    		  user.name = _answer.writer
		    	  }
		    	  _answer.user = user;
		    	  return dataFn(_answer)
		     })
		     .catch(errFn)
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
answerService.updateAnswer = function(done, answer) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  , currentAnswerNum = answer.num 
	
	if(answer.isAnnoymous()) {
		return  H.call4promise(answerDAO.findByNum, currentAnswerNum)
				 .then(function (findedAnswer) {
					 debug('pw ',answer.password, findedAnswer.password)
					 if(answer.password != findedAnswer.password) 
						 return dataFn(Status.makeError('password is not equal'))
					 else 
						 return answerDAO.update(done, answer)
				 })
				 .catch(errFn)
	} else {
		return answerDAO.update(done, answer)
	}
}
answerService.deleteAnswer = function(done, answerNum) {
	answerDAO.removeAllOfNum(done, answerNum);
}
