
var debug = require('debug')('test:service:blogServiceTest')
var mongoose = require('mongoose');
var should = require('should')
  , path = require('path')

var H = require('../testHelper.js')

var Post = require('../../domain/blogBoard/Post.js')
  , Answer= require('../../domain/blogBoard/Answer.js')
  , Category = require('../../domain/blogBoard/Category.js')
  , User = require('../../domain/User.js')
  
var Transaction = require('../../dao/util/transaction/Transaction.js')
var postDAO = require('../../dao/blogBoard/postDAO.js')
  , answerDAO = require('../../dao/blogBoard/answerDAO.js')
  , categoryDAO = require('../../dao/blogBoard/categoryDAO.js')
  , userDAO = require('../../dao/userDAO.js')
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
			blogService.getFullList(new H.Done(dataFn, errFn), curPageNum, null, Category.getRootId());
			function dataFn(FullList) {
//				console.log(FullList)
				var pager = FullList.pager
				  , posts = FullList.posts
				  , allCategories = FullList.allCategories
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
//				console.log(e_post)
				should.equal(e_post.num, post.num);
//				console.log(e_post.answers)
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
	describe('#insertPostAndIncreaseCategoryCount', function () {
 		it('should insert post without file', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			var newPost = Post.createBy({content:'newPost', categoryId:post.categoryId})
			
			H.call4promise(blogService.insertPostAndIncreaseCategoryCount, newPost)
			 .then(function dataFn(insertedPost) {
					should.exist(insertedPost);
					should.deepEqual(insertedPost.fileInfoes, []);
					
					return H.call4promise(categoryDAO.findById, post.categoryId)
			 })
			 .then(function (category){
				 should.equal(category.postCount, 1)
				 nextTest();
			 })
			 .catch(errFn)
		})
	})
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
	describe('delete', function () {
		it('should run and rollback', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			var postNum = 1
			H.call4promise(blogService.deletePost, postNum)
			.then(function (status) {
				should.equal(status.isSuccess(), true)
				nextTest()
			})
			.catch(errFn)				
			
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
				post.fileInfoes = []
				
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
			mongoose.disconnect(function(d) {
					nextTest();
			});
	})
	.catch(errFn)
}