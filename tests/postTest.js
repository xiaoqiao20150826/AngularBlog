
/* test */

var mongoose = require('mongoose')
  , should = require('should')
  , Q = require('q')
  , async = require('async');

var testHelper = require('./testHelper.js');

var _ = require('underscore'),
	H = require('../common/helper.js');
var	postDAO = require('../dao/postDAO.js');
var	Post = require('../domain/Post.js');

describe('aPostDAO', function() {
	var _posts,_post;
//	before(function(asyncDone) {
//		mongoose.connect('mongodb://localhost/test',function() {
//			_insertTestData(asyncDone);
//		});
//		
//	});
//	after(function(asyncDone) {
//		postDAO.removeAll(function(){
//			mongoose.disconnect(asyncDone);
//		});
//	});
	beforeEach(function() {
		_posts = _createTempPosts();
	});
	describe('#insertOne()', function() {
		it('should insert a post.',function (asyncDone) {
			postDAO.insertOne(done, _posts[3]);
			function done(model) {
				console.log('ssss');
				var expectedPost = Post.createBy(data);
				_equals(expectedPost,_posts[3]);
				asyncDone();
			};
		});
	});
//	describe('#find()',function() {
//		it('should take all posts', function (asyncDone) {
//			postDAO.find(done, {});
//			function done(models) {
//				var e_posts =  Post.createBy(models)
//				_equals(e_posts,_posts.slice(0, e_posts.length));
//				asyncDone();
//			}
//		});
//		it('should take a post', function (asyncDone) {
//			var num = 2;
//			postDAO.findByNum(done, num);
//			function done(model) {
//				var e_post = Post.createByModel(model);
//				var a_post = _posts[num-1];
//				_equals(a_post, e_post);
//				asyncDone();
//			}
//		});
//		it('should take posts by range', function (asyncDone) {
//			var start = 4
//				,end = 6;
//			postDAO.findByRange(done, start,end);
//			function done(models) {
//				var e_posts = Post.createBy(models);
//				var a_posts = _posts.slice(start-1,end);
//				_equals(a_posts,e_posts);
//				asyncDone();
//			}
//		});
//	});
//	describe('#count', function() {
//		it('should take count of all posts', function(asyncDone) {
//			postDAO.getCount(done);
//			function done(model) {
//				var a_count = _posts.length +1;
//				var e_count = model;
//				should.exist(model);
//				should.equal(a_count,e_count);
//				asyncDone();
//			}
//		});
//		it('should take count with where', function(asyncDone) {
//			var where = {title:/title/};
//			postDAO.getCount(done);
//			function done(model) {
//				var a_count = _posts.length +1;
//				var e_count = model;
//				should.exist(model);
//				should.equal(a_count,e_count);
//				asyncDone();
//			}
//		});
//	});
//	describe('#update', function() {
//		it('should update',function(asyncDone) {
//			var num = 3 , success = 1
//			 	,a_post = _posts[num-1];
//			a_post.num = num;
//			a_post.title = 'title_update';
//			a_post.content = 'content_update';
//			
//			postDAO.update(done, a_post);
//			function done(bool) {
//				should.equal(bool, success);
//				postDAO.findByNum(done2, num);
//				function done2(model) {
//					var e_post = Post.createByModel(model);
//					_equals(a_post, e_post);
//					asyncDone();
//				}
//			}
//		});
//		it('should update readCount', function(asyncDone) {
//				var num = 2, success = 1
//					,testArray = [num, num, num, num]
//					,a_count=testArray.length;
//				H.asyncLoop(testArray,postDAO.updateReadCount, done);
//				function done() {
//					postDAO.findByNum(done2, num);
//					function done2(model) {
//						var e_post = Post.createByModel(model);
//						should.equal(a_count, e_post.readCount);
//						asyncDone();
//					}
//				}
//			});
//		});
	});
////////==== helper =====/////////
//현재는 title, content만 비교함.
function _equals(expectedPosts, posts) {
	should.exist(expectedPosts);
	should.exist(posts); //없는것을 비교하려하는지..확인.
var equalOne = __equalOne1('title','content');
	if(!(expectedPosts instanceof Array) && !(posts instanceof Array)) {
		return equalOne(expectedPosts,posts);
	}
	for(var i in posts) {
		equalOne(expectedPosts[i],posts[i]);
	}
	function __equalOne1() {
		var args = _.toArray(arguments);
		return function(e, a) {
			for(i in args) {
				var key = args[i];
				should.equal(e[key],a[key]);
			}	
		};
	};
};

function _createTempPosts() {
	var post = new Post()
	  , count = 10
	  , fields4TempValue = ['title','content'];
	return posts = testHelper.createObjs(post, count, fields4TempValue);
}
function _insertTestData(done) {
	H.asyncLoop(_createTempPosts(), postDAO.insertOne, done);
};
