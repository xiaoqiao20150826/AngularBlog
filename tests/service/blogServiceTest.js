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
var _postNum = 2;
var postCount = 100; // answer만들면서 1개 플러스 됨
var answerCount = 20;
describe('blogService', function () {
	before(function(nextCase) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextCase);
		});
	});
	after(function(nextCase) {
		var errFn = H.testCatch1(nextCase);
		Q.all([postDAO.removeAll(H.doneOrErrFn(function() {}, errFn))
			 , answerDAO.removeAll(H.doneOrErrFn(function() {}, errFn))
			 ])
		.then(function() {
			mongoose.disconnect(function(d) {
//				console.log('after--------',d);
				nextCase();
			});
		})
		.catch(errFn);
	});
	describe('#datasOfPageNum', function() {
		it('should take datas', function (nextCase) {
			var curPageNum = 1;
			var doneOrErrFn = H.doneOrErrFn(done, H.testCatch1(nextCase));
			
			blogService.datasOfPageNum(doneOrErrFn, curPageNum);
			
			function done(datas) {
				var answerCount = datas.answerCount.shift(); //현재 한개밖에 안나옴.
				
				should.equal(datas.pageCount, 11); //post가 101개 row는 10개씩 총 11개
				should.equal(datas.posts.pop().num, 10); //1-10 ...31-40 
				should.equal(answerCount._id, _postNum);
				should.equal(answerCount.count, 20);
				nextCase();
			}
		});
	});
	describe('#datasOfPostNum', function() {
		it('should take post and answers', function (nextCase) {
			var postNum = 2;
			var doneOrErrFn = H.doneOrErrFn(done, H.testCatch1(nextCase));
			
			blogService.datasOfPostNum(doneOrErrFn, postNum);
				
			function done(datas) {
				var e_post = datas.post;
				var e_answers = datas.answers;
				should.exist(e_post);
				should.exist(e_answers);
				should.equal(e_post.num, postNum);
				should.equal(e_answers.length, 20);
				nextCase();
			}
		});
	});
	
});

/* helper */
function _equals(expectedPosts, actualsPosts) {
	H.deepEqualsByKeys(expectedPosts, actualsPosts, keys4tempValue);
};
///////////////////answerTest, postTest 에서 그대로 가져옴.
function _insertTestData(nextCase) {
	var errFn = H.testCatch1(nextCase);
	
	H.asyncLoop(_createTempPosts(), [postDAO, postDAO.insertOne], nextDone, errFn);
	function nextDone(err, datas) {
		var post = Post.createBy({num:_postNum, title:'title', content:'content'});
		var answers = _createAnswers(post.num);
		
		postDAO.insertOne(H.doneOrErrFn(nextDone2, errFn) , post);
		function nextDone2(d) {
			
			H.asyncLoop(answers, [answerDAO, answerDAO.insertOne], endDone, errFn);
				function endDone(err, datas) {
					nextCase();
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