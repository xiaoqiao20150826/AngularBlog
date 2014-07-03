
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
		postDAO.removeAll(H.doneOrErrFn(function() {
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
			postDAO.insertOne(H.doneOrErrFn(done, _testCatch1(nextCase)), _posts[3]);
			function done(model) {
				var expectedPost = Post.createBy(model);
					_equals(expectedPost,_posts[3]);
					nextCase();
			};
		});
	});
	describe('#find()',function() {
		it('should take all posts', function (nextCase) {
			postDAO.find(done, {});
			function done(models) {
				var e_posts =  Post.createBy(models)
				_equals(e_posts,_posts.slice(0, e_posts.length));
				nextCase();
			}
		});
		it('should take a post', function (nextCase) {
			var num = 2;
			postDAO.findByNum(done, num);
			function done(model) {
				var e_post = Post.createBy(model);
				var a_post = _posts[num-1];
				_equals(a_post, e_post);
				nextCase();
			}
		});
		it('should take posts by range', function (nextCase) {
			var start = 4
				,end= 6;
			postDAO.findByRange(done, start,end);
			function done(models) {
				var e_posts = Post.createBy(models);
				var a_posts = _posts.slice(start-1,end);
				_equals(a_posts,e_posts);
				nextCase();
			}
		});
	});
	describe('#count', function() {
		it('should take count of all posts', function(nextCase) {
			postDAO.getCount(done);
			function done(model) {
				var a_count = _posts.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
		it('should take count with where', function(nextCase) {
			var where = {title:/title/};
			postDAO.getCount(done);
			function done(model) {
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
			
			postDAO.update(done, a_post);
			function done(bool) {
				should.equal(bool, success);
				postDAO.findByNum(done2, num);
				function done2(model) {
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
				H.asyncLoop(testArray,postDAO.updateReadCount, done);
				function done() {
					postDAO.findByNum(done2, num);
					function done2(model) {
						var e_post = Post.createBy(model);
						should.equal(a_count, e_post.readCount);
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
	return posts = testHelper.createObjsByType(Type, count, keys4tempValue);
}
function _insertTestData(nextCase) {
	H.asyncLoop(_createTempPosts(), [postDAO, postDAO.insertOne], nextCaseDone, _testCatch1(nextCase));
	function nextCaseDone(err, datas) {
		nextCase();
	}
	
};
function _testCatch1(nextCase) {
	return function (err) {
		console.trace(err);
		nextCase(err)
	}
}
