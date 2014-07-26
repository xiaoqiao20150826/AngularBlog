/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var Q = require('q');
var H = require('../common/helper.js')
  , fsHelper = require('../common/fsHelper.js')
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

// pageNum에 해당하는 블로그 데이터를 가져온다.
blogService.getPostsAndPager = function (done, curPageNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var result = {};
	
	return H.call4promise([postDAO, postDAO.getCount])
		    .then(function (allRowCount) {
		    	var pager = new Pager(allRowCount)
		    	  , rowNums = pager.getStartAndEndRowNumBy(curPageNum);
		    	result.pager = pager;
		    	return H.call4promise([postDAO.findByRange], rowNums.start, rowNums.end);
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

blogService.insertPostWithFile = function(done, post, file) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var promise = null;
	if(_existFile(file)) {
		var urls = _getToAndFromUrls(file, config.imgDir);
		promise = H.call4promise(fsHelper.copyNoDuplicate, urls.from , urls.to)
				   .then(function(savedFileUrl) {
					   post.addFilePath(savedFileUrl);
				    })
				   .catch(errFn);
	};
	
	// 이 구조. 다시 나오면 고민좀 해봐야겠다.
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
		 if(H.exist(filepath)) return H.call4promise(fsHelper.delete, filepath); 
	 })
	 .then(function() { //성공실패 모두. undefined반환..
		 dataFn();
	 })
	 .catch(errFn);
}

//기능(나중에 옮길지도)
function _getToAndFromUrls(fromFile, imgDir) {
	var fileName = fromFile.name
	  , fromFileUrl = fromFile.path //임시저장된 파일위치
	  , toFileUrl = imgDir + '\\' + fileName;
	  
	return {to : toFileUrl, from : fromFileUrl };
}
function _existFile(file) {
	if(file.size != 0 )
		return true;
	else
		return false;
} 