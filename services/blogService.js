/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../common/helper.js')
  , Q = require('q');

var User = require('../domain/User.js')
  , Blog = require('../domain/Blog.js')
  , userDAO = require('../dao/userDAO.js')
  , boardService = require('./boardService.js');


/* define  */
var blogService = module.exports = {};

/* functions */
blogService.getBlogBy = function (done, pageNum, loginId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	var blog = new Blog();
	
	H.call4promise(boardService.getBoardByPageNum, pageNum)
	 .then(function(board) {
		 blog.setBoard(board);
		 if(H.exist(loginId)) return H.call4promise(userDAO.findById, loginId);
	 })//then은 위조건이 만족되지 못하더라도 연속적으로 호출됨.
	 .then(function(loginUser) {
		 if(H.exist(loginUser)) blog.setLoginUser(loginUser);
		 dataFn(blog);
	 })
	 .catch(errFn);
}
