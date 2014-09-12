/**
 * 
 */
//TODO: BoardPost가 적절한데.
/* 참조 및 초기화 */

var H = require('../../common/helper.js')
  , _ = require('underscore')
  
var User = require('../User.js')
  

//////////////////
var Post = module.exports = function Post() {
	this._id = null;
	this.num = 0;
	this.readCount = 0;
	this.vote = 0;
	this.votedUserIds = [];
	this.fileInfoes = [];  
	this.title = '';
	this.content = '';
	this.created = Date.now();
	this.answerCount = 0;
	this.userId = User.ANNOYMOUS_ID;
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
	return _findValuesAboutKey(posts, 'userId')
}
Post.getNums = function (posts) {
	return _findValuesAboutKey(posts, 'num')
}
//
Post.getFileInfoes = function (posts) {
	var values = _findValuesAboutKey(posts, 'fileInfoes')
	return _.compact(_.flatten(values))
}
//post에 categoryId 조인할때
Post.getCategoryIds = function (posts) {
	return _findValuesAboutKey(posts, 'categoryId')
}
//delete할때.
Post.getCategoryIdAndCountMap = function (posts) {
	var categoryIds = Post.getCategoryIds(posts)
	return _.countBy(_.compact(categoryIds))
}
function _findValuesAboutKey(posts, key) {
	var result = [];
	for(var i in posts) {
		var post = posts[i]
		  , value = post[key]
		if(H.exist(value) ) { result.push(value); }
	}
	return result;
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

Post.prototype.addFileInfoes = function (fileInfoes) {
	if(!_.isArray(fileInfoes)) fileInfoes = [fileInfoes]
	this.fileInfoes = fileInfoes;
};

// etc
Post.prototype.hasFile = function () {
	if(!_.isEmpty(this.fileInfoes))
		return true
	else
		return false;
}
Post.prototype.isEmpty = function() {
	if(this.num == 0) return true
	else return false;
}