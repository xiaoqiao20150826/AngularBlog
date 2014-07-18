

var mongoose = require('mongoose');
var should = require('should')
  , Q = require('q');

var H = require('../testHelper.js')
  , fsHelper = require('../../common/fsHelper.js');

var Post = require('../../domain/Post.js')
  , Answer= require('../../domain/Answer.js')
  , User = require('../../domain/User.js');
var postDAO = require('../../dao/postDAO.js')
  , answerDAO = require('../../dao/answerDAO.js')
  , userDAO = require('../../dao/userDAO.js');
var boardService = require('../../services/boardService.js');

// 테스트를 위한 참조, 입력한 데이터에 대한.  
var userId, postNum, post, user, answer1, answer2;
var testFileUrl = __dirname + '\\\\test.txt';
//  
describe('boardService',function() {
	before(function(nextTest) {
		_createAndInsertTestData(nextTest);
	});
	after(function(nextTest) {
		_deleteAllTestData(nextTest)
	});
	
	describe('#getBoardByPageNum',function () {
		it('should get board', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var curPageNum = 1;
			boardService.getBoardByPageNum(done, curPageNum)
			function dataFn(board) {
				var post4web = board.getPosts4web().pop();
				
				should.equal(post.content, post4web.post.content)
				should.equal(null, post4web.answers)
				should.equal(user._id , post4web.user._id)
				should.equal(2, post4web.answerCount)
				nextTest();
			}
		})
	})
	describe('#getPost4webByPostNum',function () {
		it('should get post4web', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var postNum = 1;	
			boardService.getPost4WebByPostNum(done, postNum);
			function dataFn(post4web) {
				should.equal(post.content, post4web.post.content)
				should.equal(answer1.content, post4web.answers.pop().content)
				should.equal(user._id , post4web.user._id)
				should.equal(2, post4web.answerCount)
				nextTest();
			}
		})
	})
	describe('#insertPost', function () {
		it('should insert post without file', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var emptyFile = {size:0};
			boardService.insertPost(done, post, emptyFile);
			function dataFn(post) {
				should.exist(post);
				should.equal(post.filePaths, null);
				nextTest();
			}
		})
		it('should insert post with file', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			
			var file = {size:2, name:'test2.txt', path:testFileUrl};
			boardService.insertPost(done, post, file);
			function dataFn(post) {
				(post.filePaths.indexOf('test2.txt') != -1).should.be.true
				nextTest();
			}
		})
	})
})

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
	
	answer1 = new Answer();
	answer1.num = 1;
	answer1.userId = userId;
	answer1.postNum = postNum;
	answer1.content = 'answerContent1'
	answer2 = new Answer();
	answer2.num = 2;
	answer2.userId = userId;
	answer2.postNum = postNum;
	answer2.content = 'answerContent2'

	var errFn = H.testCatch1(nextTest);
	var done = new H.Done(function() {}, errFn);
	mongoose.connect('mongodb://localhost/test',function() {
		Q.all([ postDAO.insertOne(done, post)
			  , answerDAO.insertOne(done, answer1)
			  , answerDAO.insertOne(done, answer2)
			  , userDAO.insertOne(done, user)
		])
		 .then(function() {
			var dataInFile = '2222lmfelwm3ㅎㅈㄷㅎㄷㅈㅎ w3 3g';
			return H.call4promise(fsHelper.create, testFileUrl, dataInFile);
		 })
		 .then(function(url) {
			 testFileUrl = url;
			 nextTest();
		})
		.catch(errFn);
	});
}
function _deleteAllTestData(nextTest) {
	var errFn = H.testCatch1(nextTest);
	var done = new H.Done(function() {}, errFn);
	Q.all([postDAO.removeAll(done)
		 , answerDAO.removeAll(done)
		 , userDAO.removeAll(done)
	])
	.then(function() {
		return H.call4promise(fsHelper.delete, testFileUrl);
	})
	.then(function() { //이건 만들어진거 직접..삭제
		return H.call4promise(fsHelper.delete, 'D:\\java\\_Workspace\\work4node\\NodeBlog\\resources\\img\\test2.txt');
	})
	.then(function() {
			mongoose.disconnect(function(d) {
			nextTest();
			});
	})
	.catch(errFn);
}