/**
 * 통합테스트라서... post,answer의 테스트데이터에 의존한다.
 * posts 1~10, answers 1~10
 * 차라리 boardServiceTest처럼 수동으로 알아보게 테스트를 넣는것이 나았다.
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
	describe('$getBlogBy', function( ) {
		it('should take blog object by pageNum and id', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var pageNum = 1;
			var id = 'emptyUser';
			blogService.getBlogBy(new H.Done(dataFn, errFn), pageNum, id);
			
			function dataFn(blog) {
				should.equal(blog.loginUser , null) //null...현재 데이터가 없어서..
				var board = blog.board
				  , pager = board.pager
				  , post4web = board.posts4web;
				should.equal(pager.allRowCount, 11);
				should.equal(post4web[1].answerCount, 20);
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