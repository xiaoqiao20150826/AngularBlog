
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
	before(function(nextCase) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextCase);
		});
		
	});
	after(function(nextCase) {
		postDAO.removeAll(new H.Done(function() {
						mongoose.disconnect(function(a,b) {
//							console.log('after',a,b);
							nextCase();
						})
		}));
	});
	beforeEach(function() {
		_posts = _createTempPosts();
	});
	describe('#insertOne()', function() {
		it('should insert a post.',function (nextCase) {
			postDAO.insertOne(new H.Done(dataFn, _testCatch1(nextCase)), _posts[3]);
			function dataFn(model) {
				var expectedPost = Post.createBy(model);
					_equals(expectedPost,_posts[3]);
					nextCase();
			};
		});
	});
	describe('#find()',function() {
		it('should take all posts', function (nextCase) {
			postDAO.find(new H.Done(dataFn, _testCatch1(nextCase)), {});
			function dataFn(models) {
				var e_posts =  Post.createBy(models)
				_equals(e_posts,_posts.slice(0, e_posts.length));
				nextCase();
			}
		});
		it('should take a post', function (nextCase) {
			var num = 2;
			postDAO.findByNum(new H.Done(dataFn, _testCatch1(nextCase)), num);
			function dataFn(model) {
				var e_post = Post.createBy(model);
				var a_post = _posts[num-1];
				_equals(a_post, e_post);
				nextCase();
			}
		});
		it('should take posts by range', function (nextCase) {
			var start = 4
				,end= 6;
			postDAO.findByRange(new H.Done(dataFn, _testCatch1(nextCase)), start,end);
			function dataFn(models) {
				var e_posts = Post.createBy(models);
				var a_posts = _posts.slice(start-1,end);
				_equals(a_posts.pop(),e_posts.pop());
				nextCase();
			}
		});
	});
	describe('#count', function() {
		it('should take count of all posts', function(nextCase) {
			postDAO.getCount(new H.Done(dataFn, _testCatch1(nextCase)));
			function dataFn(model) {
				var a_count = _posts.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
		it('should take count with where', function(nextCase) {
			var where = {title:/title/};
			postDAO.getCount(new H.Done(dataFn, _testCatch1(nextCase)));
			function dataFn(model) {
				var a_count = _posts.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
	});
	describe('#update', function() {
		it('should update',function(nextCase) {
			var num = 3 , success = 1
			 	,a_post = _posts[num-1];
			a_post.num = num;
			a_post.title = 'title_update';
			a_post.content = 'content_update';
			
			postDAO.update(new H.Done(dataFn, _testCatch1(nextCase)), a_post);
			function dataFn(bool) {
				should.equal(bool, success);
				postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextCase)), num);
				function dataFn2(model) {
					var e_post = Post.createBy(model);
					_equals(a_post, e_post);
					nextCase();
				}
			}
		});
		it('should update readCount', function(nextCase) {
				var num = 2, success = 1
					,testArray = [num, num, num, num]
					,a_count=testArray.length;
				H.asyncLoop(testArray,postDAO.updateReadCount, new H.Done(dataFn, _testCatch1(nextCase)) );
				function dataFn(bool) {
					postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextCase)), num);
					function dataFn2(model) {
						should.equal(a_count, model.readCount);
						nextCase();
					}
				}
		});
		it('should updateVoteAndVotedUserId', function(nextCase) {
			var num = 2, userId = 'aaa', success = 1
			var errFn =  _testCatch1(nextCase);
			postDAO.updateVoteAndVotedUserId(new H.Done(dataFn, errFn), num, userId);
			function dataFn(bool) {
				should.equal(bool, success)
				postDAO.findByNum(new H.Done(dataFn2, errFn), num);
				function dataFn2(post) {
					should.equal(post.vote, 1)
					should.deepEqual(post.votedUserIds, [userId])
					nextCase();
				}
			}
		});
	});
});
////////==== helper =====/////////
//현재는 title, content만 비교함.
function _equals(expectedPosts, actualsPosts) {
	testHelper.deepEqualsByKeys(expectedPosts, actualsPosts, keys4tempValue);
};

function _createTempPosts() {
	var Type = Post
	  , count = 10;
	posts = testHelper.createObjsByType(Type, count, keys4tempValue);
	return posts;
}
function _insertTestData(nextCase) {
	H.asyncLoop(_createTempPosts(), [postDAO, postDAO.insertOne], new H.Done(dataFn, _testCatch1(nextCase)) );
	function dataFn(datas) {
		nextCase();
	}
	
};
function _testCatch1(nextCase) {
	return function (err) {
		console.trace(err);
		nextCase(err)
	}
}
