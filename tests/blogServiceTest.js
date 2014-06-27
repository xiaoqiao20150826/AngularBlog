	/**
	 * 통합테스트라서... post,answer의 테스트데이터에 의존한다.
	 * posts 1~10, answers 1~10
	 */
var blogServiceTest = module.exports = {};
var postTest = require('./postTest.js')
  , answerTest = require('./answerTest.js');

blogServiceTest.run = function() {
	
	var should = require('should')
		,H = require('../common/helper.js')
		,mongoose = require('mongoose')
		,postDAO = require('../dao/postDAO.js')
		,answerDAO = require('../dao/answerDAO.js')
		,blogService = require('../services/blogService.js');
	
	describe('blogService', function () {
		before(function(asyncDone) {
			mongoose.connect('mongodb://localhost/test',function() {
				_insertTestData(asyncDone);
			});
		});
		after(function(asyncDone) {
				answerDAO.removeAll(function(){
					postDAO.removeAll(function() {
						mongoose.disconnect(function() {
							asyncDone();					
						});
					});
				});
		});
		describe('#datasOfPageNum', function() {
			it('should take datas', function (asyncDone) {
				var curPageNum = 0;
				blogService.datasOfPageNum(done, 1);
				function done(datas) {
					should.equal(datas.pageCount, 3);
					should.equal(datas.posts.length, 5);
					should.equal(datas.answerCounts.shift().count, 10);
					asyncDone();
				}
			});
		});
		describe('#datasOfPostNum', function(asyncDone) {
			it('should take post and answers', function () {
				var postNum = 0;
				blogService.datasOfPostNum(done, postNum);
					
				function done(datas) {
					console.log('d '+datas);
					var e_post = datas.shift();
					var e_answers = datas.shift();
					should.exist(e_post);
					should.exist(e_answers);
					should.equal(e_post.num, postNum);
					should.equal(e_answers.length, 10);
					asyncDone();
				}
			});
		});
		
	});
	
	/* helper */
	function _insertTestData(done) {
		console.log('f',postTest)
		H.call4done(postTest.insertTestData)
		 .then(work1)
		 .then(done);
		 
		function work1() {
			return H.call4done(answerTest.insertTestData);
		};
	};
};

//temp
blogServiceTest.run();