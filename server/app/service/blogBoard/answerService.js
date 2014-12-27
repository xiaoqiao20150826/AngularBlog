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
//includedNums 이용하여 자식도 모두 삭제에서 -> 자식있으면 제거안되는 방식으로 바꿈.
function _answersToTree (joinedAnswers) {
    var answerJoiner = new Joiner(joinedAnswers, 'answerNum', 'answers')
//	answerJoiner.setKey4aggregateToParent('num', ',', 'includedNums') //부모로모아. 포함된(나 + 자식) num을.
    return answerJoiner.treeTo(Answer.makeRoot(), 'num', function(node) {
    	node.password = undefined // 데이터 송신 전 password안보이게.
    });
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
				 	 
				 	 insertedAnswer.password = null; //없에야..
				   	 return insertedAnswer;
				 })
};
answerService.updateAnswer = function(answer) {
	var currentAnswerNum = answer.num 
	
	if(answer.isAnnoymous()) {
		return  answerDAO.findByNum( currentAnswerNum)
				 .then(function (findedAnswer) {
					 debug('annoy answer pw ',answer.password, findedAnswer.password)
					 if(answer.password != findedAnswer.password) 
						 return Status.makeError('password is not equal')
					 else 
						 return answerDAO.update(answer)
				 })
	} else {
		return answerDAO.update(answer)
	}
}

//자식 있으면 표시만, 없으면 다 지움.
answerService.deleteAnswer = function(answer) {
	var currentNum = answer.num
	  , postNum    = answer.postNum;
	var deferred     = Q.defer()
	  
	Q.all([answerDAO.findByNum(currentNum)
	      ,answerDAO.find({answerNum: currentNum}) 
	     ])
		 .then(function(args) {
			 var currentAnswer = args[0]
			   , childAnswers  = args[1]
			   , hasChild	   = !_.isEmpty(childAnswers);
			 
			 //익명이면서, 패스워드 일치하지않으면.
			 if(currentAnswer.isAnnoymous() && (   _.isEmpty(answer.password)
					 							|| (answer.password != currentAnswer.password )
					 							)
			 	){
				 return deferred.resolve(Status.makeError('password is not equal'))
			 }
			 //자식있으면 업데이트.땡 post의 answerCount..일단 냅두자.
			 if(hasChild) {
				 currentAnswer.content = "<span bgcolor='grey'>삭제된 댓글 입니다.</span>"
				 return  answerDAO.update(currentAnswer)
				 				  .then(function(status) {
				 					  if(status.isError && status.isError()) return deferred.resolve(status)
				 					  else return deferred.resolve(Status.makeSuccess('delete answer'))
				 				  })
			 }
			 //이제 자식없으면 걍 지워~
			 answerService.deleteAnswerAndDecreaseAnswerCount(postNum, currentNum)
			 			  .then(function(status) {
			 				  return deferred.resolve(status)
			 			  })
		 });
	
	return deferred.promise;
}

// 지우고, 카운트도.
// 이게 따른방식을 쓰다가 값만바꾼것이라.. 코드가 좀 요상함.
answerService.deleteAnswerAndDecreaseAnswerCount = function(postNum, answerNum) {
	return Q.all([
	                answerDAO.removeAllOfNum( [answerNum])
	              , postDAO.decreaseAnswerCount( postNum, 1)
				 ])
				 .then(function(statuses){
				   	 return Status.reduceOne(statuses)
				 })
};
