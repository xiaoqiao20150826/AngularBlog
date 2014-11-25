
/* test */

var debug = require('debug')('test:dao:postTest')
var should = require('should');
var mongoose = require('mongoose')
  , Q = require('q')

var testHelper = require('../testHelper.js');

var _ = require('underscore'),
	H = require('../testHelper.js')
var	postDAO = require('../../dao/blogBoard/postDAO.js');
var	Post = require('../../domain/blogBoard/Post.js');
var initDataCreater = require('../../initDataCreater')


//-------------------------------
describe('aPostDAO', function() {
	var _posts
	this.timeout(10000) // timeout setting
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			//1.create users
			_posts = _createTempPosts() 
			//2. insert users
			_.reduce(_posts, function (p, post){
				return p.then(function() {
					return postDAO.insertOne(post);
				})
			}, initDataCreater.create())
			.then(function () { nextTest() })
			.catch(H.testCatch1(nextTest))
		});
	});
	after(function(nextTest) {
		Q.all([ postDAO.removeAll()
			  , initDataCreater.removeAll()
        ])
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(H.testCatch1(nextTest))
	});
	describe('#find()',function() {
		it('should take all posts', function (nextTest) {
			postDAO.find({})
			.then(function dataFn(posts) {
				debug('findAll',posts)
				should.equal(posts.length,	10);
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
		it('should take a post', function (nextTest) {
			var num = 2;
			postDAO.findByNum(num)
			.then(function dataFn(e_post) {
				var a_post = _posts[num-1];
				should.equal(a_post.title, e_post.title);
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
		it('should take posts by range', function (nextTest) {
			var start = 4
				,end= 6;
			postDAO.findByRange(start,end)
			.then(function dataFn(e_posts) {
				debug('range:',e_posts)  //역순출력됨.
				should.equal(_posts[6].title,e_posts[0].title);
				should.equal(_posts[4].title,e_posts[2].title);
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
//		
		it('should find all posts By date', function (nextTest) {
			var userId = 'annoymous';
			postDAO.findGroupedPostsByDate(userId)
			.then(function dataFn(GroupedPostsByDate) {
				debug('groupedPosts : ',GroupedPostsByDate);
				should.equal(GroupedPostsByDate['2014']['7']['31'].count, 2)
				should.equal(GroupedPostsByDate['2014']['6'].count, 1)
				should.equal(GroupedPostsByDate['2013'].count, 5)
				should.equal(GroupedPostsByDate.count,10)
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		})
//
	});
//	
//	describe('#insertOne()', function() {
//		it('should insert a post.',function (nextTest) {
//			//testData 넣은것으로 퉁~
//		});
//	});
	describe('#count', function() {
		it('should take count of all posts', function(nextTest) {
			postDAO.getCount()
			.then(function dataFn(count) {
				should.equal(count, 10);
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
		it('should take count with where', function(nextTest) {
			var where = {title:/title/};
			postDAO.getCount(null, where)
			.then(function dataFn(count) {
				should.equal(count, 10);
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
	});
	describe('#update', function() {
		it('should update',function(nextTest) {
			var num = 3 
			  , a_post = _posts[num-1];
			a_post.num = num;
			a_post.title = 'title_update';
			a_post.content = 'content_update';
			postDAO.update(a_post)
			.then(function dataFn(status) {
				should.equal(status.isSuccess(),true);
				return postDAO.findByNum(num)
			 })
			 .then(function dataFn2(e_post) {
				should.equal(a_post.num, e_post.num);
				should.equal(a_post.title, e_post.title);
		     })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
		it('should update readCount', function(nextTest) {
				var num = 2
				_.reduce([1,2,3], function(p, v){
					return p.then(function(){
						return postDAO.updateReadCount(num)
					});
				},Q())
				.then(function dataFn() {
					return postDAO.findByNum(num)
			     })
			    .then(function dataFn2(post) {
						should.equal(post.readCount, 3);
			     }) 
				 .then(function () { nextTest() })
				 .catch(H.testCatch1(nextTest))
		});
		it('should updateVoteAndVotedUserId', function(nextTest) {
			var num = 2, userId = 'aaa'
			
			postDAO.updateVoteAndVotedUserId(num, userId)
			.then(function dataFn() {
				return postDAO.findByNum(num)
		     })			
			.then(function dataFn2(post) {
					should.equal(post.vote, 1)
					should.deepEqual(post.votedUserIds, [userId])
		     }) 
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
		it('should increase answerCount', function(nextTest) {
			var num = 2
			_.reduce([1,2,3], function(p, v){
				return p.then(function(){
					return postDAO.increaseAnswerCount(num)
				});
			},Q())
			.then(function dataFn() {
				return postDAO.findByNum(num)
		     })
			.then(function dataFn2(post) {
				should.equal(post.answerCount, 3);
		     }) 
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
		// 위에서 3로 바꿨으니. -2 하면 1;
		it('should decrease answerCount', function(nextTest) {
			var postNum = 2
			  , answerCount = 2;
			
			postDAO.decreaseAnswerCount(postNum, answerCount)
			.then(function dataFn(status) {
				should.equal(status.isSuccess(),true);
				return postDAO.findByNum(postNum);
		     }) 
		     .then(function dataFn2(post) {
				should.equal(post.answerCount, 1);
		     })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
		});
	});
	
});
////////==== helper =====/////////
//1406724018189
function _createTempPosts() {
	var Type = Post
	  , count = 10;
	posts = testHelper.createObjsByType(Type, count, ['title','content']);
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

	posts[0].title = "title 1"
	posts[1].title = "title 2"
	posts[2].title = "title 3"
	posts[3].title = "title 4"
	posts[4].title = "title 5"
		
	posts[5].title = "title 6"
	posts[6].title = "title 7"
	posts[7].title = "title 8"
	posts[8].title = "title 9"
	posts[9].title = "title 10"		
	return posts;
}
