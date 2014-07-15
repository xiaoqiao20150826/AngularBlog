/**
 * 통합테스트라서... post,answer의 테스트데이터에 의존한다.
 * posts 1~10, answers 1~10
 */

var should = require('should')
	,mongoose = require('mongoose')
	,Q = require('q')
	,_ = require('underscore')
	
	,H = require('../testHelper.js')
	
	,postDAO = require('../../dao/postDAO.js')
	,answerDAO = require('../../dao/answerDAO.js')
	,Post = require('../../domain/Post.js')
	,Answer = require('../../domain/Answer.js')
	,blogService = require('../../services/blogService.js');



var keys4tempValue = ['content'];
var __postNum = 2;
var postCount = 10; // answer만들면서 1개 플러스 됨
var answerCount = 20;
describe('blogService', function () {
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextTest);
		});
	});
	after(function(nextTest) {
		var errFn = H.testCatch1(nextTest);
		Q.all([postDAO.removeAll(new H.Done(function() {}, errFn))
			 , answerDAO.removeAll(new H.Done(function() {}, errFn))
			 ])
		.then(function() {
			mongoose.disconnect(function(d) {
				nextTest();
			});
		})
		.catch(errFn);
	});
	describe('#datasOfPageNum', function() {
		it('should take datas', function (nextTest) {
			var curPageNum = 1;
			var done = new H.Done(dataFn, H.testCatch1(nextTest));
			
			blogService.datasOfPageNum(done, curPageNum);
			
			function dataFn(blog) {
				var pager = blog.getPager();
				should.equal(pager.getPageCount(), 2); //post가 11개 row는 10개씩 총 2개
				
				var post4Webs = blog.getPost4Webs()
				  , post4Web = post4Webs[1]
				  , post =  post4Web.getPost()
				  , answerCount = post4Web.getAnswerCount()
				  , user = post4Web.getUser();
				
				should.equal(user.name, 'annoymous');
				should.equal(post.title, 'title2');
				should.equal(answerCount, 20);
				nextTest();
			}
		});
	});
	describe('#datasOfPostNum', function() {
		it('should take post and answers', function (nextTest) {
			var postNum = 2;
			var done = new H.Done(dataFn, H.testCatch1(nextTest));
			
			blogService.datasOfPostNum(done, postNum);
				
			function dataFn(blog) {
				var post4Webs = blog.getPost4Webs()
				  , post4Web = post4Webs.pop()
				  , post =  post4Web.getPost()
				  , answerCount = post4Web.getAnswerCount()
				  , answers = post4Web.getAnswers()
				  , user = post4Web.getUser();
				should.equal(user, null);
				should.equal(post.title, 'title2');
				should.equal(answerCount, 20);
				should.equal(answers.length, 20); //TODO: 답변에서도 유저정보를 뽑아야하는데....
				nextTest();
			}
		});
	});
	describe('$getBlogBy', function( ) {
		it('should take blog object by pageNum and id', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var pageNum = 1;
			var id = 'weg'; // 테스트 데이터가 없어..
			blogService.getBlogBy(new H.Done(dataFn, errFn), pageNum, id);
			
			function dataFn(blog) {
				var pager = blog.getPager();
				should.equal(pager.getPageCount(), 2); //post가 11개 row는 10개씩 총 2개
				
				var post4Webs = blog.getPost4Webs()
				  , post4Web = post4Webs[1]
				  , post =  post4Web.getPost()
				  , answerCount = post4Web.getAnswerCount()
				  , user = post4Web.getUser();
				
				should.equal(user.name, 'annoymous');
				should.equal(post.title, 'title2');
				should.equal(answerCount, 20);
				should.equal(blog.loginUser , null) //null...현재 데이터가 없어서..
				nextTest();
			}
				
		})
	})
	
});

/* helper */
function _equals(expectedPosts, actualsPosts) {
	H.deepEqualsByKeys(expectedPosts, actualsPosts, keys4tempValue);
};
///////////////////answerTest, postTest 에서 그대로 가져옴.
function _insertTestData(nextTest) {
	var errFn = H.testCatch1(nextTest);
	
	H.asyncLoop(_createTempPosts(), [postDAO, postDAO.insertOne], new H.Done(nextDataFn, errFn));
	function nextDataFn(datas) {
		var post = Post.createBy({num:__postNum, title:'title', content:'content'});
		postDAO.insertOne(new H.Done(nextDataFn2, errFn) , post);
		
		function nextDataFn2(d) {
			var answers = _createAnswers(__postNum);
			H.asyncLoop(answers, [answerDAO, answerDAO.insertOne], new H.Done(endDataFn, errFn));
			
				function endDataFn(datas) {
					nextTest();
				}
		}
	}
};

function _createAnswers(postNum) {
	var answers = H.createObjsByType(Answer, answerCount, keys4tempValue);
	_.each(answers, function(val) {
		val['postNum'] = postNum;
	})
	return answers;
}
function _createTempPosts() {
	return posts = H.createObjsByType(Post, postCount, ['title','content']);
}