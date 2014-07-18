/**
 * 블로그 데이터를 위한 클래스.
 * 각 객체를 담거나, 필요 기능의 함수를 제공한다.
 * 
 */
var Board = require('./Board.js')
  , User = require('./User.js');

var Blog = module.exports = function Blog () {
	this.loginUser = null;
	this.board = null;
	
}
Blog.prototype.setLoginUser = function (loginUser) {
	this.loginUser = loginUser;
};
Blog.prototype.setBoard = function (board) {
	this.board = board;
}

// get
