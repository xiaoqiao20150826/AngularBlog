
/* test */

var should = require('should');
var mongoose = require('mongoose')
  , Q = require('q')
  , async = require('async');

var testHelper = require('../testHelper.js');

var _ = require('underscore'),
	H = require('../../common/helper.js');
var	postDAO = require('../../dao/postDAO.js');
var	Post = require('../../domain/Post.js');

// test데이터를 삽입하고, eqaul비교 때 사용할 post의 프로퍼티 이름..
var keys4tempValue = ['title','content'];


//-------------------------------
describe('aPostDAO', function() {
	var _posts,_post;
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextTest);
		});
		
	});
	after(function(nextTest) {
		postDAO.removeAll(new H.Done(function() {
						mongoose.disconnect(function(a,b) {
//							console.log('after',a,b);
							nextTest();
						})
		}));
	});
	beforeEach(function() {
		_posts = _createTempPosts();
	});
	describe('#insertOne()', function() {
		it('should insert a post.',function (nextTest) {
			postDAO.insertOne(new H.Done(dataFn, _testCatch1(nextTest)), _posts[3]);
			function dataFn(model) {
				var expectedPost = Post.createBy(model);
					_equals(expectedPost,_posts[3]);
					nextTest();
			};
		});
	});
	describe('#find()',function() {
		it('should take all posts', function (nextTest) {
			postDAO.find(new H.Done(dataFn, _testCatch1(nextTest)), {});
			function dataFn(models) {
				var e_posts =  Post.createBy(models)
				_equals(e_posts,_posts.slice(0, e_posts.length));
				nextTest();
			}
		});
		it('should take a post', function (nextTest) {
			var num = 2;
			postDAO.findByNum(new H.Done(dataFn, _testCatch1(nextTest)), num);
			function dataFn(model) {
				var e_post = Post.createBy(model);
				var a_post = _posts[num-1];
				_equals(a_post, e_post);
				nextTest();
			}
		});
		it('should take posts by range', function (nextTest) {
			var start = 4
				,end= 6;
			postDAO.findByRange(new H.Done(dataFn, _testCatch1(nextTest)), start,end);
			function dataFn(models) {
				var e_posts = Post.createBy(models);
				var a_posts = _posts.slice(start-1,end);
				_equals(a_posts.pop(),e_posts.pop());
				nextTest();
			}
		});
	});
	describe('#count', function() {
		it('should take count of all posts', function(nextTest) {
			postDAO.getCount(new H.Done(dataFn, _testCatch1(nextTest)));
			function dataFn(model) {
				var a_count = _posts.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextTest();
			}
		});
		it('should take count with where', function(nextTest) {
			var where = {title:/title/};
			postDAO.getCount(new H.Done(dataFn, _testCatch1(nextTest)));
			function dataFn(model) {
				var a_count = _posts.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextTest();
			}
		});
	});
	describe('#update', function() {
		it('should update',function(nextTest) {
			var num = 3 , success = 1
			 	,a_post = _posts[num-1];
			a_post.num = num;
			a_post.title = 'title_update';
			a_post.content = 'content_update';
			
			postDAO.update(new H.Done(dataFn, _testCatch1(nextTest)), a_post);
			function dataFn(bool) {
				should.equal(bool, success);
				postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextTest)), num);
				function dataFn2(model) {
					var e_post = Post.createBy(model);
					_equals(a_post, e_post);
					nextTest();
				}
			}
		});
		it('should update readCount', function(nextTest) {
				var num = 2, success = 1
					,testArray = [num, num, num, num]
					,a_count=testArray.length;
				H.asyncLoop(testArray,postDAO.updateReadCount, new H.Done(dataFn, _testCatch1(nextTest)) );
				function dataFn(bool) {
					postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextTest)), num);
					function dataFn2(model) {
						should.equal(a_count, model.readCount);
						nextTest();
					}
				}
		});
		it('should updateVoteAndVotedUserId', function(nextTest) {
			var num = 2, userId = 'aaa', success = 1
			var errFn =  _testCatch1(nextTest);
			postDAO.updateVoteAndVotedUserId(new H.Done(dataFn, errFn), num, userId);
			function dataFn(bool) {
				should.equal(bool, success)
				postDAO.findByNum(new H.Done(dataFn2, errFn), num);
				function dataFn2(post) {
					should.equal(post.vote, 1)
					should.deepEqual(post.votedUserIds, [userId])
					nextTest();
				}
			}
		});
		it('should increase answerCount', function(nextTest) {
			var num = 2
			  , testArray = [num, num, num, num]
			  , a_count=testArray.length;
			H.asyncLoop(testArray,postDAO.increaseAnswerCount, new H.Done(dataFn, _testCatch1(nextTest)) );
			function dataFn(bool) {
				postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextTest)), num);
				function dataFn2(post) {
					should.equal(a_count, post.answerCount);
					nextTest();
				}
			}
		});
		// 위에서 4로 바꿨으니. -3 하면 1;
		it('should decrease answerCount', function(nextTest) {
			var errFn = _testCatch1(nextTest);
			var postNum = 2
			  , answerCount = 3;
			
			postDAO.decreaseAnswerCount(new H.Done(dataFn, errFn), postNum, answerCount);
			
			function dataFn(bool) {
				should.equal(bool, 1);
				postDAO.findByNum(new H.Done(dataFn2, errFn), postNum);
				function dataFn2(post) {
					should.equal(post.answerCount, 1);
					nextTest();
				}
			}
		});
	});
	describe('$posts By date', function () {
		it('should all posts By date', function (nextTest) {
			var errFn = _testCatch1(nextTest);
			var userId = 'annoymous';
			postDAO.findAllByDate(new H.Done(dataFn, errFn), userId)
			function dataFn(list) {
				console.log(list);
				console.log(arguments)
				nextTest();
			};
		
			
		})
	});
	
});
////////==== helper =====/////////
//현재는 title, content만 비교함.
function _equals(expectedPosts, actualsPosts) {
	testHelper.deepEqualsByKeys(expectedPosts, actualsPosts, keys4tempValue);
};
//1406724018189
function _createTempPosts() {
	var Type = Post
	  , count = 10;
	posts = testHelper.createObjsByType(Type, count, keys4tempValue);
	posts[0].created = 0106624028189;
	posts[1].created = 0206624028189;
	posts[2].created = 0306424008189;
	posts[3].created = 0406424008189;
	posts[4].created = 006724017189;
	posts[5].created = 1406724018189;
	posts[6].created = 1406724018189;
	posts[7].created = 1406724018189;
	posts[8].created = 1406724018189;
	posts[9].created = 1406724018189;
	
	return posts;
}
function _insertTestData(nextTest) {
	H.asyncLoop(_createTempPosts(), [postDAO, postDAO.insertOne], new H.Done(dataFn, _testCatch1(nextTest)) );
	function dataFn(datas) {
		nextTest();
	}
	
};
function _testCatch1(nextTest) {
	return function (err) {
		console.trace(err);
		nextTest(err)
	}
}
