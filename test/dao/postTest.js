
/* test */

var debug = require('debug')('test:dao:postTest')
var should = require('should');
var mongoose = require('mongoose')
  , Q = require('q')
  , async = require('async');

var testHelper = require('../testHelper.js');

var _ = require('underscore'),
	H = require('../testHelper.js')
var	postDAO = require('../../dao/blogBoard/postDAO.js');
var	Post = require('../../domain/blogBoard/Post.js');
var initDataCreater = require('../../initDataCreater')

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
	after(function(nextCase) {
		var errFn = H.testCatch1(nextCase);
		H.all4promise([ postDAO.removeAll
			          , initDataCreater.removeAll
        ])
		.then(function() {
			mongoose.disconnect(function() {
				nextCase();
			});
		})
		.catch(errFn);
	});
	beforeEach(function() {
		_posts = _createTempPosts();
	});
	describe('#find()',function() {
		it('should take all posts', function (nextTest) {
			postDAO.find(new H.Done(dataFn, _testCatch1(nextTest)), {});
			function dataFn(posts) {
				_equals(posts,_posts.slice(0, posts.length));
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
				var a_posts = _posts.slice(start,end+1);
				_equals(a_posts[a_posts.length-1],e_posts[0]);
				nextTest();
			}
		});
		
		it('should find all posts By date', function (nextTest) {
			var errFn = _testCatch1(nextTest);
			var userId = 'annoymous';
			postDAO.findGroupedPostsByDate(new H.Done(dataFn, errFn), userId)
			function dataFn(GroupedPostsByDate) {
//				console.log(GroupedPostsByDate);
				should.equal(GroupedPostsByDate['2014']['7']['31'].count, 2)
				should.equal(GroupedPostsByDate['2014']['6'].count, 1)
				should.equal(GroupedPostsByDate['2013'].count, 5)
				should.equal(GroupedPostsByDate.count,10)
				nextTest();
			};
		})
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
			var num = 3 
			  , a_post = _posts[num-1];
			a_post.num = num;
			a_post.title = 'title_update';
			a_post.content = 'content_update';
			postDAO.update(new H.Done(dataFn, _testCatch1(nextTest)), a_post);
			function dataFn(status) {
				should.equal(status.isSuccess(),true);
				postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextTest)), num);
				function dataFn2(model) {
					var e_post = Post.createBy(model);
					_equals(a_post, e_post);
					nextTest();
				}
			}
		});
		it('should update readCount', function(nextTest) {
				var num = 2
					,testArray = [num, num, num, num]
					,a_count=testArray.length;
				H.asyncLoop(testArray,postDAO.updateReadCount, new H.Done(dataFn, _testCatch1(nextTest)) );
				function dataFn() {
					postDAO.findByNum(new H.Done(dataFn2, _testCatch1(nextTest)), num);
					function dataFn2(model) {
						should.equal(a_count, model.readCount);
						nextTest();
					}
				}
		});
		it('should updateVoteAndVotedUserId', function(nextTest) {
			var num = 2, userId = 'aaa'
			var errFn =  _testCatch1(nextTest);
			postDAO.updateVoteAndVotedUserId(new H.Done(dataFn, errFn), num, userId);
			function dataFn() {
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
			function dataFn() {
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
			function dataFn(status) {
				should.equal(status.isSuccess(),true);
				postDAO.findByNum(new H.Done(dataFn2, errFn), postNum);
				function dataFn2(post) {
//					console.log(post)
					should.equal(post.answerCount, 1);
					nextTest();
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
//1406724018189
function _createTempPosts() {
	var Type = Post
	  , count = 10;
	posts = testHelper.createObjsByType(Type, count, keys4tempValue);
	posts[0].created = "2013-11-30T04:04:33.131Z"
	posts[1].created = "2013-07-10T04:04:33.131Z"
	posts[2].created = "2013-07-22T04:04:33.131Z"
	posts[3].created = "2013-09-22T04:04:33.131Z"
	posts[4].created = "2013-09-25T04:04:33.131Z"
		
	posts[5].created = "2014-02-11T04:04:33.131Z"
	posts[6].created = "2014-06-11T04:04:33.131Z"
	posts[7].created = "2014-04-11T04:04:33.131Z"
	posts[8].created = "2014-07-31T04:04:33.131Z"
	posts[9].created = "2014-07-31T04:04:33.131Z"
	
	return posts;
}
function _insertTestData(nextTest) {
	H.call4promise(initDataCreater.create)
	 .then(function() {
		 H.asyncLoop(_createTempPosts(), [postDAO, postDAO.insertOne], new H.Done(dataFn, _testCatch1(nextTest)) );
			function dataFn(datas) {
				nextTest();
			} 
	 })
	
	
};
function _testCatch1(nextTest) {
	return function (err) {
		console.trace(err);
		nextTest(err)
	}
}
