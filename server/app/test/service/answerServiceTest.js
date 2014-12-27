

var mongoose = require('mongoose');
var should = require('should')
  , Q = require('q')
  , debug = require('debug')('test:service:answerServiceTest')
  , log = console.log
  
var H = require('../testHelper.js')

var Post = require('../../domain/blogBoard/Post.js')
  , Answer= require('../../domain/blogBoard/Answer.js')
  , User = require('../../domain/User.js');
var answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , postDAO = require('../../dao/blogBoard/postDAO.js')
  , userDAO = require('../../dao/userDAO.js');
var initDataCreater = require('../../initDataCreater')

var answerService = require('../../service/blogBoard/answerService.js');

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
			answerService.getRootOfAnswerTree(postNum)
			.then(function dataFn(root) {
				var answers = root.answers
				debug('joinedAnswers :', answers)
				should.equal(answers[1].user, answers[1].answers.pop().user)
				var lowAnswer = answers[1].answers[0]
				should.equal(lowAnswer.num,3)
				should.equal(lowAnswer.answerNum, 2 )
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
		it('should take emptyanswer by wrong answerNum', function (nextTest) {
			answerService.getRootOfAnswerTree(22)
			.then(function dataFn(root) {
				var e_answers = root.answers
//				console.log(root)
				debug('answers empty ',e_answers)
				should.equal(e_answers.length,0);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
	})
	describe('#insert', function () {
		it('should insert answer and increase answerCount of post', function (nextTest) {
			var answer = new Answer();
			answer.postNum = postNum;
			answer.content = 'answerContent2';
			answer.userId = userId;
			
			answerService.insertAnswerAndIncreasePostCount(answer)
			.then(function dataFn(insertedAnswer) {
				return postDAO.findByNum( insertedAnswer.postNum)
			})
			.then(function dataFn2(post) {
				should.equal(post.answerCount,1)
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
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
	
	mongoose.connect('mongodb://localhost/test',function() {
		//순서를 지켜야해
		
		initDataCreater.create()
		.then(function() {return postDAO.insertOne( post )})
		.then(function() {return answerDAO.insertOne( answer)})
		.then(function() {return answerDAO.insertOne( answer2)})
		.then(function() {return answerDAO.insertOne( answer3)})
		.then(function() {return answerDAO.insertOne( answer4)})
		.then(function() {return userDAO.insertOne(user)})
		.then(function() {nextTest();})
		.catch(H.testCatch1(nextTest))
	});
}
function _deleteAllTestData(nextTest) {
	Q.all([postDAO.removeAll()
		 , answerDAO.removeAll()
		 , userDAO.removeAll()
		 , initDataCreater.removeAll()
	])
	.then(function() {
			mongoose.disconnect(function(d) {
					nextTest();
			});
	})
	.catch(H.testCatch1(nextTest))
}