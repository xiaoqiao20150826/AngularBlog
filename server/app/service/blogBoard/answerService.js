/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var _ = require('underscore')
  , debug = require('debug')('nodeblog:service:answerService')

var Q = require('q')  
  
var H = require('../../common/helper.js')
  , config = require('../../config.js')
  , Status = require('../../common/Status.js')

var Answer = require('../../domain/blogBoard/Answer.js')
  , User = require('../../domain/User.js')
  , Joiner = require('../../dao/util/Joiner.js')

var answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , postDAO = require('../../dao/blogBoard/postDAO.js')
  , userDAO = require('../../dao/userDAO.js')


/* define  */
var answerService = module.exports = {};

/* functions */

//postNum의 answer를 가져와서 트리형태로 만든다.
//이때 루트는 num 이 null 인 answer
answerService.getRootOfAnswerTree = function (postNum) {
	var _answers;
	
	return answerDAO.findByPostNum(postNum)
	 		.then(function (answers) {
	 			_answers = answers
	 			var userIds = Answer.getUserIds(_answers);
	 	    	return userDAO.findByIds(userIds);
	 		})
			 .then(function (users) {
				 var joinedAnswers = _joinUsersToAnswers(_answers, users)
				   , rootOfTree	   = _answersToTree(joinedAnswers)
				   
			     return rootOfTree
			})
}
// 조인한 후, 트리화 시킨다.
function _answersToTree (joinedAnswers) {
    var answerJoiner = new Joiner(joinedAnswers, 'answerNum', 'answers')
	answerJoiner.setKey4aggregateToParent('num', ',', 'includedNums') //부모로모아. 포함된(나 + 자식) num을.
    return answerJoiner.treeTo(Answer.makeRoot(), 'num');
}
function _joinUsersToAnswers(answers, users) {
	//user가 있거나, id에 해당하는 유저가 없다면. 익명유저이어라. 
    var userJoiner = new Joiner(users, '_id', 'user')
    var joinedAnswerByUser = userJoiner.joinTo(answers, 'userId', function (_answer) {
    	  var user = User.getAnnoymousUser()
    	  user.name = _answer.writer 
    	  return user;
      });
    
    
    return joinedAnswerByUser;
}

answerService.getJoinedAnswer = function (currentAnswerNum) {
	
	var _answer = null  
    return  answerDAO.findByNum( currentAnswerNum)
		     .then(function(answer) {
		    	 _answer = answer;
		    	 
		    	 if(answer.isAnnoymous()) 
		    		 return null;
		    	 else
		    		 return userDAO.findById( answer.userId)
		     })
		      .then(function (user) {
		    	  if(user == null) {
		    		  user = User.getAnnoymousUser()
		    		  user.name = _answer.writer
		    	  }
		    	  _answer.user = user;
		    	  return _answer
		     })
}


answerService.insertAnswerAndIncreasePostCount = function(answer) {
	var postNum = answer.postNum;
	
	return Q.all([  
			        answerDAO.insertOne( answer)
			      , postDAO.increaseAnswerCount( postNum)
				 ])
				 .then(function(args){
				 	 var insertedAnswer = args[0];
				   	 return insertedAnswer;
				 })
};
answerService.updateAnswer = function(answer) {
	var currentAnswerNum = answer.num 
	
	if(answer.isAnnoymous()) {
		return  answerDAO.findByNum( currentAnswerNum)
				 .then(function (findedAnswer) {
					 debug('pw ',answer.password, findedAnswer.password)
					 if(answer.password != findedAnswer.password) 
						 return Status.makeError('password is not equal')
					 else 
						 return answerDAO.update(answer)
				 })
	} else {
		return answerDAO.update(answer)
	}
}

answerService.deleteAnswer = function(answer, includedNums) {
	var currentNum = answer.num
	  , postNum = answer.postNum
	  
	if(answer.isAnnoymous()) {
		return  answerDAO.findByNum( currentNum)
				 .then(function (findedAnswer) {
					 debug('annoymous writer of answer ; pw ',answer.password, findedAnswer.password)
					 if(answer.password != findedAnswer.password) 
						 return Status.makeError('password is not equal')
					 else 
						 return answerService.deleteAnswerAndDecreaseAnswerCount(postNum, includedNums);
				 })
	} else {
		
		return answerService.deleteAnswerAndDecreaseAnswerCount(postNum, includedNums);
	}
}


answerService.deleteAnswerAndDecreaseAnswerCount = function(postNum, includedNums) {
	var answerCount = includedNums.length
	
	return Q.all([
	                answerDAO.removeAllOfNum( includedNums)
	              , postDAO.decreaseAnswerCount( postNum, answerCount)
				 ])
				 .then(function(statuses){
				   	 return Status.reduceOne(statuses)
				 })
};
