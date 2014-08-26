
var debug = require('debug')('test:service:blogServiceTest')
var mongoose = require('mongoose');
var should = require('should')
  , path = require('path')

var H = require('../testHelper.js')
  , localFile = require('../../common/localFile.js');

var Post = require('../../domain/blogBoard/Post.js')
  , Answer= require('../../domain/blogBoard/Answer.js')
  , Category = require('../../domain/blogBoard/Category.js')
  , User = require('../../domain/User.js')
  
var postDAO = require('../../dao/blogBoard/postDAO.js')
  , answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , userDAO = require('../../dao/userDAO.js');
var blogService = require('../../service/blogBoard/blogBoardService.js')
var initDataCreater = require('../../initDataCreater')
// 테스트를 위한 참조, 입력한 데이터에 대한.  
var userId, postNum, post, user, answer1, answer2;
var categoryId

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
		it('should get postsAndPager', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , done = new H.Done(dataFn, errFn);
			var curPageNum = 1;
			blogService.getPostsAndPagerAndAllCategoires(new H.Done(dataFn, errFn), curPageNum, null, Category.getRootId());
			function dataFn(PostsAndPagerAndAllCategoires) {
//				console.log(PostsAndPagerAndAllCategoires)
				var pager = PostsAndPagerAndAllCategoires.pager
				  , posts = PostsAndPagerAndAllCategoires.posts
				  , allCategories = PostsAndPagerAndAllCategoires.allCategories
				  , post = posts[0];
				should.equal(pager.allRowCount, 1);
				should.equal(post.content, 'postContent1')
				should.equal(post.user.name , 'kang')
				should.equal(post.category.title , 'root')
				should.equal(allCategories[0].title , 'root')
				nextTest();
			}
		});
		it('should get joinedPosts', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			var categories = [Category.makeRoot()]
			H.call4promise(postDAO.find)
			 .then(function(posts) {
				 return H.call4promise(blogService.getJoinedPostsByUsersAndCategories, posts, categories) 
			 })
			 .then(function(joinedPosts) {
				 var joinedPost = joinedPosts[0]
				 should.equal(joinedPost.user.name , 'kang')
				 should.equal(joinedPost.category.title , 'root')
				 nextTest()
			 })
			 .catch(errFn)
		})
	})
	describe('#getJoinedPost', function( ) {
		it('should take realPost by postNum', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			blogService.getJoinedPost(new H.Done(dataFn, errFn), post.num);
			function dataFn(e_post) {
				should.equal(e_post.num, post.num);
				should.equal(e_post.answers.pop().num, 2);
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
	var errFn = H.testCatch1(nextTest);
	 mongoose.connect('mongodb://localhost/test',function() {
		H.call4promise(initDataCreater.create)
		 .then(function() {
				categoryId = Category.getRootId()
				
				userId = '1_github';
				postNum = 1;
				
				post = new Post();
				post.num = postNum;
				post.content = 'postContent1';
				post.userId = userId;
				post.categoryId = categoryId
				
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
			 
			 H.all4promise([   [ postDAO.insertOne, post] 
					         , [ answerDAO.insertOne, answer1]
					         , [ answerDAO.insertOne, answer2]
					         , [ userDAO.insertOne, user]
					         ])
					         .then(function() {
					        	 var dataInFile = '2222lmfelwm3ㅎㅈㄷㅎㄷㅈㅎ w3 3g';
					        	 return H.call4promise(localFile.create, testFileUrl, dataInFile);
					         })
					         .then(function(url) {
					        	 testFileUrl = url;
					        	 nextTest();
					         })
					         .catch(errFn)
		 });
	 })
}
function _deleteAllTestData(nextTest) {
	var errFn = H.testCatch1(nextTest);
	var done = new H.Done(function() {}, errFn);
	
	H.all4promise([postDAO.removeAll
				 , answerDAO.removeAll
				 , userDAO.removeAll
				 , initDataCreater.removeAll
	])
	.then(function() {
		return H.call4promise(localFile.delete, testFileUrl);
	})
	.then(function() {
			mongoose.disconnect(function(d) {
					nextTest();
			});
	})
	.catch(errFn)
}