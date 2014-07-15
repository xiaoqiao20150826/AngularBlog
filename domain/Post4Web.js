/**
 * 
 */

/* 참조 및 초기화 */
var H = require('../common/helper.js')
  , _ = require('underscore')

//////////////////
var Post4Web = module.exports = function Post4Web() {
	this._post = null;
	this._user = null;
	this._answers = null;
	this._answerCount = 0;
};
Post4Web.createBy = function (post, user, answerCount, answers) {
	var post4Web = new Post4Web();
	post4Web._post = post;
	post4Web._user = user;
	post4Web._answerCount = answerCount;
	post4Web._answers = answers;
	return post4Web;
}
/* static method */


/* instance method */
//get
Post4Web.prototype.getPost = function () {
	return this._post;
};
Post4Web.prototype.getUser = function () {
	return this._user;
}
Post4Web.prototype.getAnswers = function () {
	return this._answers;
}
Post4Web.prototype.getAnswerCount = function () {
	return this._answerCount;
}
