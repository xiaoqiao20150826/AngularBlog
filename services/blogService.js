/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../common/helper.js')
  , Q = require('q');
var Post = require('../domain/Post.js')
  , User = require('../domain/User.js')
  , Blog = require('../domain/Blog.js');

var postDAO = require('../dao/postDAO.js')
  , userDAO = require('../dao/userDAO.js')
   ,answerDAO = require('../dao/answerDAO.js')
   ,Pager = require('../common/Pager.js');


/* define  */
var blogService = module.exports = {};

/* functions */
// pageNum에 해당하는 블로그 데이터를 가져온다.
blogService.datasOfPageNum = function (done, curPageNum) {
	var dataFn = done.getDataFn();
	var errFn = done.getErrFn();
	
	var blog = new Blog()
	  , _posts, _answerCount, _users;
	
	return H.call4promise([postDAO, postDAO.getCount])
		    .then(work1)
			.then(work2)
			.then(work3)
			.then(work4)
			.catch(errFn);
	// 각 함수를 호출하며 데이터를 blog에 모은다.
	function work1(allRowCount) {
		var pager = new Pager(allRowCount)
		  , rowNums = pager.getStartAndEndRowNumBy(curPageNum);
		  
		blog.setPager(pager);
		return H.call4promise([postDAO.findByRange], rowNums.start, rowNums.end);
	}
	function work2(posts) {
		_posts = posts
		var userIds = Post.getUserIds(posts);
		return H.call4promise([userDAO.findByIds], userIds)
	}
	function work3(users) {
		_users = users;
		return H.call4promise([answerDAO.getCountsByPosts], _posts)
	}
	function work4(answerCounts) { 
		_answerCounts = answerCounts;
		blog.setPost4Webs(_posts, _users, _answerCounts);
		dataFn(blog);
	}
};

//postNum에 해당하는 블로그 데이터를 가져온다.
blogService.datasOfPostNum = function (done, postNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var blog = new Blog()
	  , _post, _user;
	
	H.call4promise(postDAO.findByNum, postNum)
	 .then(function (post) {
		 _post = post;
		 var userId = post.getUserId();
		 return H.call4promise([userDAO.findById], userId);
	 })
	 .then(function (user) {
		 _user = user;
		 return H.call4promise(answerDAO.findByPostNum, postNum)
	 })
	 .then(function (answers) {
		 blog.setPost4Web(_post, _user, answers);
		 dataFn(blog);
	 })
	 .catch(errFn);
}
blogService.getBlogBy = function (done, pageNum, loginId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	var blog;
	
	H.call4promise(blogService.datasOfPageNum, pageNum)
	 .then(function(blogHasData) {
		 blog = blogHasData;
		 if(H.exist(loginId)) return H.call4promise(userDAO.findById, loginId);
	 })
	 .then(function(loginUser) {
		 //find...가 호출되고 또 데이터 도 있을경우만 할당
		 if(H.exist(loginUser)) blog.setLoginUser(loginUser);
		 dataFn(blog);
	 })
	 .catch(errFn);
}
