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
	this.filePaths = null;
	this.title = '';
	this.content = '';
	this.userId = C.ANNOYMOUS_ID;
	this.created = Date.now();
	
	////web용 데이터
	this.answerCount = 0;
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
// 이름이...
// 참조를 이용하여 실제 데이터를 할당한다.
Post.setUserByReal = function(posts, users) {
	H.joinSourcesIntoTagerts(users, posts, 'user' , function(user, post) {
		if(user._id == post.userId) 
			return user;
	});
}
Post.setAnswerCountByReal = function(posts, answerCounts) {
	H.joinSourcesIntoTagerts(answerCounts, posts, 'answerCount' , function(answerCount, post) {
		if(answerCount._id == post.num) 
			return answerCount.count;
	}, 0);
}
/* instance method */
//get
Post.prototype.getTitle4Url = function () {
	return this.title.trim().replace(/\s+/g, '-');
};
Post.prototype.getNum = function () {
	return this.num;
};
Post.prototype.getUserId = function () {
	return this.userId;
};
Post.prototype.getFileName = function () {
	var filePath = this.filePaths;
	if(this.hasFile())
		return filePath.slice(filePath.lastIndexOf('\\')+1);
	else
		return null;
}


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
Post.prototype.addFilePath = function (path) {
	if(this.filePaths == null) this.filePaths = []; 
	this.filePaths = _.union(this.filePaths, path);
};
// etc
Post.prototype.hasFile = function () {
	if(this.filePaths)
		return true
	else
		return false;
}
Post.prototype.isEmpty = function() {
	if(this.num == 0) return true
	else return false;
}