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
  , Board = require('../domain/Board.js')
  , Post4web = require('../domain/Post4web.js');

var postDAO = require('../dao/postDAO.js')
  , userDAO = require('../dao/userDAO.js')
   ,answerDAO = require('../dao/answerDAO.js')
   ,Pager = require('../common/Pager.js');


/* define  */
var boardService = module.exports = {};

/* functions */
// pageNum에 해당하는 블로그 데이터를 가져온다.
boardService.getBoardByPageNum = function (done, curPageNum) {
	var dataFn = done.getDataFn();
	var errFn = done.getErrFn();
	
	var board = new Board()
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
		board.setPager(pager);
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
		board.setPosts4web(_posts, _users, _answerCounts);
		dataFn(board);
	}
};

//postNum에 해당하는 블로그 데이터를 가져온다.
boardService.getPost4WebByPostNum = function (done, postNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	  var _post, _user;
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
		 answers = answers || [];
		 var post4web = Post4web.createBy(_post, _user, answers.length, answers);
		 dataFn(post4web);
	 })
	 .catch(errFn);
}

boardService.insertPost = function(done, postData, file) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var post = Post.createBy(postData);
	
	var promise = null;
	if(_existFile(file)) {
		var urls = _getToAndFromUrls(file, config.imgDir);
		promise = H.call4promise(fsHelper.copyNoDuplicate, urls.from , urls.to)
				   .then(function(savedFileUrl) {
					   post.addFilePaths(savedFileUrl);
				    })
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