/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../common/helper.js')
  , Q = require('q');
var Post = require('../domain/Post.js');
var _postDAO = require('../dao/postDAO.js')
   ,_answerDAO = require('../dao/answerDAO.js')
   ,_pager = require('../common/pager.js');


/* define  */
var blogService = module.exports = {};

/* functions */
// pageNum에 해당하는 블로그 데이터를 가져온다.
blogService.datasOfPageNum = function (doneOrErrFn, curPageNum) {
	var done = doneOrErrFn.done;
	var errFn = doneOrErrFn.errFn || H.defaultCatch;
	var result = {}; 	//data 를 모으고.
	
	return H.call4promise([_postDAO, _postDAO.getCount])
		    .then(work1)
			.then(work2)
			.then(work3)
			.catch(errFn);
	// done에 모은 데이터 전달
	function work1(allRowCount) {
		var pageCount = _pager.getPageCount(allRowCount);
		var rowNums = _pager.getRowNums(curPageNum, allRowCount);
		
		result.pageCount = pageCount;
		return H.call4promise([_postDAO.findByRange], rowNums.start, rowNums.end);
	}
	function work2(posts) {
		result.posts = posts;
		return H.call4promise([_answerDAO.getCountsByPosts], posts);
	}
	function work3(answerCount) {
		result.answerCount = answerCount;
		done(result);
	}
};

//postNum에 해당하는 블로그 데이터를 가져온다.
blogService.datasOfPostNum = function (doneOrErrFn, postNum) {
	var done = doneOrErrFn.done;
	var errFn = doneOrErrFn.errFn || H.defaultCatch;
	
	Q.all([  H.call4promise(_postDAO.findByNum, postNum)
	       , H.call4promise(_answerDAO.findByPostNum, postNum)
	])
	 .then(argToObject)
	 .catch(errFn);
	
	function argToObject(datas) {
		var result = {};
		result.post = datas.shift();
		result.answers = datas.shift();
		done(result);
	}
}