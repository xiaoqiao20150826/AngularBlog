/**
 * 
 */

/* 참조 및 초기화 */
var H = require('../common/helper.js')
  , C = require('../common/constant.js');
  
var _ = require('underscore');

//////////////////
var Post = module.exports = function Post() {
	this.num = 0;
	this.readCount = 0;
	this.vote = 0;
	this.filePaths = null;
	this.title = '';
	this.content = '';
	this.userId = C.ANNOYMOUS_ID;
	this.created = Date.now();
};

/* static method */

/* 생성자 */
Post.createBy= function(model) {
	return H.createTargetFromSources(Post, model);
};

Post.getUserIds = function (posts) {
	var result = [];
	var key = 'userId';
	for(var i in posts) {
		var post = posts[i];
		if(H.exist(post[key])) {
			result.push(post[key]);
		}
	}
	return result;
}

/* instance method */
//get
Post.prototype.getNum = function () {
	return this.num;
};
Post.prototype.getUserId = function () {
	return this.userId;
};

//set
Post.prototype.setNum = function (num) {
	this.num = num;
};
Post.prototype.addFilePaths = function (paths) {
	this.filePaths = _.compact(_.union(this.filePaths, paths));
};
