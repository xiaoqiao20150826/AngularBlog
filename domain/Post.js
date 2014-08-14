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
	this.votedUserIds = [];
	this.filePaths = [];  // 저장할때 로컬의 절대 주소로 .지우기쉽게.
	this.title = '';
	this.content = '';
	this.created = Date.now();
	this.answerCount = 0;
	this.userId = C.ANNOYMOUS_ID;
	this.categoryId = '';	
};

/* static method */

/* 생성자 */
Post.createBy= function(model) {
	if(model == null) 
		return new Post();
	else
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
Post.getFileName4url = function (filePath) {
	return filePath.slice(filePath.lastIndexOf('\\')+1);
}

/* instance method */
//get
Post.prototype.getTitle4url = function () {
	return this.title.trim().replace(/\s+/g, '-');
};
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
Post.prototype.setUser = function (user) {
	this.user = user;
};
Post.prototype.setAnswers = function (answers) {
	this.answers = answers || [];
	this.answerCount = answers.length;
};
//deprease
Post.prototype.addFilePath = function (path) {
	if(this.filePaths == null) this.filePaths = []; 
	this.filePaths = _.union(this.filePaths, path);
};
// etc
Post.prototype.hasFile = function () {
	if(!_.isEmpty(this.filePaths))
		return true
	else
		return false;
}
Post.prototype.isEmpty = function() {
	if(this.num == 0) return true
	else return false;
}