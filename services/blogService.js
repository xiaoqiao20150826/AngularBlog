/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var Q = require('q');
var H = require('../common/helper.js')
  , path = require('path')
  , localFile = require('../common/localFile.js')
  , config = require('../config.js');

var Post = require('../domain/Post.js')
  , User = require('../domain/User.js')
  , Answer = require('../domain/Answer.js')

var postDAO = require('../dao/postDAO.js')
  , userDAO = require('../dao/userDAO.js')
   ,answerDAO = require('../dao/answerDAO.js')
   ,answerService = require('./answerService.js')
   ,Pager = require('../common/Pager.js');



/* define  */
var blogService = module.exports = {};

/* functions */
var POST_COOKIE = 'postNums';
// pageNum에 해당하는 블로그 데이터를 가져온다.
blogService.getPostsAndPager = function (done, curPageNum, sorter) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var result = {};
	
	return H.call4promise([postDAO, postDAO.getCount])
		    .then(function (allRowCount) {
		    	var pager = new Pager(allRowCount)
		    	  , rowNums = pager.getStartAndEndRowNumBy(curPageNum);
		    	result.pager = pager;
		    	return H.call4promise([postDAO.findByRange], rowNums.start, rowNums.end, sorter);
		   })
		   .then(function (posts) {
				result.posts = posts;
				var userIds = Post.getUserIds(posts);
				return H.call4promise([userDAO.findByIds], userIds)
			})
		   .then(function (users) {
				Post.setUserByReal(result.posts, users);
				return H.call4promise([answerDAO.getCountsByPosts], result.posts)
			})
		   .then(function (answerCounts) { 
				Post.setAnswerCountByReal(result.posts, answerCounts);
				dataFn(result);
			})
		   .catch(errFn);
};

//postNum에 해당하는 블로그 데이터를 가져온다.
blogService.getJoinedPost = function (done, postNum) {
	var dataFn = done.getDataFn()
	, errFn = done.getErrFn();
	
	var _post;
	H.call4promise(postDAO.findByNum, postNum)
	 .then(function (post) {
		 _post = post;
		 return H.call4promise([userDAO.findById], post.getUserId());
     })
	 .then(function (user) {
		_post.setUser(user);
		return H.call4promise(answerService.getJoinedAnswers, postNum)
	})
	.then(function (answers) {
		_post.setAnswers(answers);
		dataFn(_post);
	})
	.catch(errFn);
}
//이 구조. 너무 장황해
blogService.insertPostWithFile = function(done, post, file) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var imgDir =config.imgDir + '\\' + post.userId;
	var promise = null;
	
	if(localFile.existFile(file)) {
		var urls = localFile.getToAndFromFileUrl(file, imgDir);
		promise = H.call4promise(localFile.copyNoDuplicate, urls.from , urls.to)
				   .then(function(savedFileUrl) {
					   post.addFilePath(savedFileUrl);
				    })
				   .catch(errFn);
	};
	nextFn(promise);
	
	function nextFn(promise) {
		if(promise == null) __fn();
		else promise.then(__fn);
		
		function __fn() {
			H.call4promise(postDAO.insertOne ,post)
			 .then(dataFn).catch(errFn);
		}
	}
}
blogService.deletePostOrFile = function (done, postNum, filepath) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	H.call4promise(postDAO.removeByPostNum, postNum)
	 .then(function() {
		 if(H.exist(filepath)) {
			 H.call4promise(localFile.delete, filepath)
			  .then(function() {
				  return H.call4promise(localFile.deleteFolder, path.dirname(filepath));
				  //TODO: 사실 파일있는지  확인하고 폴더를 지워야하는데. 에러가 안나니 넘어감. exists처럼 err없이 t/f만 반환하나보다. 
			  })
		 }
	 })
	 .then(function() { //성공실패 모두. undefined반환..
		 dataFn();
	 })
	 .catch(errFn);
}

blogService.increaseReadCount = function(done, postNum, cookie) {
	if(cookie.isContains(POST_COOKIE, postNum)) {
		done.return();
	} else {
		cookie.set(POST_COOKIE, postNum);
		postDAO.updateReadCount(done, postNum);
	}
}
blogService.increaseVote = function(done, postNum, userId) {
	var errFn = done.getErrFn();
	var where = {num:postNum, votedUserIds:userId};
	H.call4promise(postDAO.findOne, where)
	 .then(function(post) {
		 var failIncreaseVote = -1; //넌 이미 투표했다
		 if(!(post.isEmpty())) return done.return(failIncreaseVote);
		 
		 postDAO.updateVoteAndVotedUserId(done, postNum, userId)
	 })
	 .catch(errFn);
}

