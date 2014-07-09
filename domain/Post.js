/**
 * 
 */

/* 참조 및 초기화 */
var H = require('../common/helper.js')
  , _ = require('underscore')
  , MAXROWSIZE_OF_ONEPAGE = 5;

//////////////////
var Post = module.exports = function Post() {
	this.num = 0;
	this.created = Date.now();
	this.readCount = 0;
	this.vote = 0;
	this.images = null;
	this.title = '';
	this.content = '';
	this.userId = '';
	this.created = Date.now();
};

/* static method */

/* 생성자 */
Post.createBy= function(model) {
	return H.createTargetFromSources(Post, model, function(post) {
		if(!(H.exist(post.userId))) post.userId = 'annoymous';
	});
};


/* instance method */
Post.prototype.getNum = function () {
	return this.num;
};
Post.prototype.setNum = function (num) {
	this.num = num;
};
