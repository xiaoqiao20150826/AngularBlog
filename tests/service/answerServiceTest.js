

var mongoose = require('mongoose');
var should = require('should')
  , Q = require('q')
  , debug = require('debug')('test:service:answerServiceTest')
  , log = console.log
  
var H = require('../testHelper.js')
  , Done = H.Done;

var Post = require('../../domain/Post.js')
  , Answer= require('../../domain/Answer.js')
  , User = require('../../domain/User.js');
var answerDAO = require('../../dao/answerDAO.js')
  , postDAO = require('../../dao/postDAO.js')
  , userDAO = require('../../dao/userDAO.js');
var initDataCreater = require('../../initDataCreater')

var answerService = require('../../services/answerService.js');

// 테스트를 위한 참조, 입력한 데이터에 대한.  
var userId, postNum, answer, user, answer1, answer2;
var testFileUrl = __dirname + '\\\\test.txt';
//
var answerWithFile4Test;

describe('answerService', function () {
	before(function(nextTest) {
		_createAndInsertTestData(nextTest);
	});
	after(function(nextTest) {
		_deleteAllTestData(nextTest)
	});
	describe('#getJoinedAnswers', function( ) {
		it('should take realAnswers by postNum', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			answerService.getJoinedAnswers(new H.Done(dataFn, errFn), postNum);
			
			function dataFn(answers) {
				debug('joinedAnswers :', answers)
				should.equal(answers[1].user, answers[1].answers.pop().user)
				var lowAnswer = answers[1].answers[0]
				should.equal(lowAnswer.num,5)
				should.equal(lowAnswer.answerNum, 2 )
				nextTest();
			}
		})
		it('should take emptyanswer by wrong answerNum', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			answerService.getJoinedAnswers(new H.Done(dataFn, errFn), 22);
			function dataFn(e_answers) {
				debug('answers empty ',e_answers)
				should.equal(e_answers.length,0);
				nextTest();
			}
		})
	})
	describe('#insert', function () {
		it('should insert answer and increase answerCount of post', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var answer = new Answer();
			answer.postNum = postNum;
			answer.content = 'answerContent2';
			answer.userId = userId;
			answerService.insertAnswerAndIncreasePostCount(new Done(dataFn, errFn), answer)
			
			function dataFn(insertedAnswer) {
				postDAO.findByNum(new Done(dataFn2, errFn), insertedAnswer.postNum)
				
				function dataFn2(post) {
					should.equal(post.answerCount,1)
					nextTest();
				}
				
			}
		})
	});
//	describe('#delete', function () {
//		
//	})
});

/* helper */

//이번에는 눈으로 확인할 수 있는 테스트 데이터를 최대한 수동으로 만들자.
//좀 길어지더라도..
function _createAndInsertTestData(nextTest) {
	userId = '1_github';
	postNum = 1;

	post = new Post();
	post.num = postNum;
	post.content = 'postContent1';
	post.userId = userId;
	
	user = new User();
	user._id = userId;
	user.name = 'kang';
	
	answer = new Answer();
	answer.num = 1;
	answer.postNum = postNum;
	answer.content = 'answerContent1';
	answer.userId = userId;
	
	answer2 = new Answer();
	answer2.num = 2;
	answer2.postNum = postNum;
	answer2.content = 'answerContent2';
	answer2.userId = userId;
	
	
	answer3 = new Answer();
	answer3.num = 3;
	answer3.userId = userId;
	answer3.answerNum = 2;
	answer3.content = 'answerContent3';
	answer3.deep = 2;
	answer3.postNum = postNum;
	answer4 = new Answer();
	answer4.num = 4;
	answer4.userId = userId;
	answer4.answerNum = 2;
	answer4.content = 'answerContent4';
	answer4.deep = 2;
	answer4.postNum = postNum;
	var errFn = H.testCatch1(nextTest);
	var done = new H.Done(function() {}, errFn);
	
	mongoose.connect('mongodb://localhost/test',function() {
		H.call4promise(initDataCreater.create)
		 .then(function() {
			H.all4promise([ [postDAO.insertOne, post]
					      , [answerDAO.insertOne, answer]
 						  , [answerDAO.insertOne, answer2]
						  , [answerDAO.insertOne, answer3]
						  , [answerDAO.insertOne, answer4]
						  , [userDAO.insertOne, user]
			])
			 .then(function() {
				 nextTest();
			})
			.catch(errFn)
		 })
	});
}
function _deleteAllTestData(nextTest) {
	var errFn = H.testCatch1(nextTest);
	H.all4promise([postDAO.removeAll
				 , answerDAO.removeAll
				 , userDAO.removeAll
				 , initDataCreater.removeAll
	])
	.then(function() {
			mongoose.disconnect(function(d) {
					nextTest();
			});
	})
	.catch(errFn)
}