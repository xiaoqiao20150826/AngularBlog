/**
 * 
 */

/* 참조 및 초기화 */
var H = require('../common/helper.js')
  , _ = require('underscore')

var User = require('./User.js');
//////////////////
var Board = module.exports = function Board() {
	this.pager = null;
	//
	this.posts = null;
};
/* static method */


/* instance method */
//get
Board.prototype.getpager = function () {
	return this.pager;
}
//set
Board.prototype.setPager= function (pager) {
	this.pager = pager;
};

