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
blogService.datasOfPageNum = function (done, curPageNum) {
	var result = {}; 	//data 를 모으고.
	H.call4done([_postDAO, _postDAO.getCount])
	 .then(work1)
	 .then(work2)
	 .then(work3)
	 .catch(H.defaultCatch); //에러아님..
	// done에 모은 데이터 전달
	function work1(allRowCount) {
		var pageCount = _pager.getPageCount(allRowCount);
		var rowNums = _pager.getRowNums(curPageNum, allRowCount);
		
		result.pageCount = pageCount;
		return H.call4done([_postDAO.findByRange], rowNums.start, rowNums.end);
	}
	function work2(posts) {
		result.posts = posts;
		return H.call4done([_answerDAO.getCountsByPosts], posts);
	}
	function work3(answerCounts) {
		result.answerCounts = answerCounts;
		done(result);
	}
};

//postNum에 해당하는 블로그 데이터를 가져온다.
blogService.datasOfPostNum = function (done, postNum) {
	Q.all([  H.call4done(_postDAO.findByNum,postNum)
	       , H.call4done(_answerDAO.findByPostNum,postNum)
	     ])
	       .then(done)
	       .catch(H.defaultCatch);
}