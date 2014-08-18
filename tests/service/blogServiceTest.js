
var debug = require('debug')('test:service:blogServiceTest')
var mongoose = require('mongoose');
var should = require('should')
  , path = require('path')
  , Q = require('q');

var H = require('../testHelper.js')
  , localFile = require('../../common/localFile.js');

var Post = require('../../domain/Post.js')
  , Answer= require('../../domain/Answer.js')
  , User = require('../../domain/User.js');
var postDAO = require('../../dao/postDAO.js')
  , answerDAO = require('../../dao/answerDAO.js')
  , userDAO = require('../../dao/userDAO.js');
var blogService = require('../../services/blogService.js')

// 테스트를 위한 참조, 입력한 데이터에 대한.  
var userId, postNum, post, user, answer1, answer2;

var testFileName = 'test.txt'
  , testFileUrl = __dirname + '\\' + testFileName;
//
var _postWithFile4Test;

describe('blogService', function () {
	before(function(nextTest) {
		_createAndInsertTestData(nextTest);
	});
	after(function(nextTest) {
		_deleteAllTestData(nextTest)
	});
	describe('$getPostsAndPager', function( ) {
		it('should get board data', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var curPageNum = 1;
			blogService.getPostsAndPager(new H.Done(dataFn, errFn), curPageNum);
			function dataFn(postsAndPager) {
				var e_pager = postsAndPager.pager
				  , e_post = postsAndPager.posts.pop();
				should.equal(e_pager.allRowCount, 1);
				should.equal(post.content, e_post.content)
				should.equal(null, e_post.answers)
				should.equal(user._id , e_post.user._id)
				nextTest();
			}
		});
	})
	describe('#getJoinedPost', function( ) {
		it('should take realPost by postNum', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			blogService.getJoinedPost(new H.Done(dataFn, errFn), post.num);
			
			function dataFn(e_post) {
				should.equal(e_post.num, post.num);
				should.equal(e_post.answers.pop().num, 1);
				nextTest();
				
			}
		})
		it('should take emptyPost by wrong postNum', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			blogService.getJoinedPost(new H.Done(dataFn, errFn), 4);
			function dataFn(e_post) {
				should.equal(e_post.num, new Post().num);
				nextTest();
			}
		})
	})
	describe('#insertPostWithFile', function () {
		it('should insert post without file', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var emptyFile = {size:0};
			blogService.insertPostWithFile(done, post, emptyFile);
			function dataFn(post) {
				should.exist(post);
				should.deepEqual(post.filePaths, []);
				nextTest();
			}
		})
	})
//	describe('#deletePostOrFile', function() {
//		it('should delete post with null filepath', function(nextTest) {
//			var errFn = H.testCatch1(nextTest)
//			  , done = new H.Done(dataFn, errFn);
//			var filepath = null
//			  , postNum = post.num;
//			blogService.deletePostOrFile(done, postNum , filepath);
//			function dataFn() {
//				//이곳까지와서 nextTest()만 호출하면됨.
////				console.log('without')
//				nextTest();
//			}
//		})
//		it('should delete post and file', function(nextTest) {
//			var errFn = H.testCatch1(nextTest)
//			, done = new H.Done(dataFn, errFn);
//			//위에서 삽입했던 데이터 재활용..겸 삭제
//			blogService.deletePostOrFile(done, _postWithFile4Test.num , _postWithFile4Test.filePaths);
//			function dataFn() {
//				//이곳까지와서 nextTest()만 호출하면됨.
////				console.log('with')
//				nextTest();
//			}
//		})
//	})
	describe('#update', function () {
		it('should success increaseVote', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var postNum = 1;
			var userId = 'AAA';
			blogService.increaseVote(done, postNum, userId);
			function dataFn(status) {
				debug('success arg', arguments)
				should.equal(status.isSuccess(), true)
				nextTest()
			}
		})
		it('should fail increaseVote ', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var postNum = 1;
			var userId = 'AAA';
			blogService.increaseVote(done, postNum, userId);
			function dataFn(status) {
				debug('fail arg ', arguments);
				should.equal(status.isError(), true)
				nextTest()
			}
		})
	})
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
			return H.call4promise(localFile.create, testFileUrl, dataInFile);
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
		return H.call4promise(localFile.delete, testFileUrl);
	})
	.then(function() {
			mongoose.disconnect(function(d) {
//				setTimeout(function() {
					nextTest();
//				},100)
			});
	})
	.catch(errFn);
}