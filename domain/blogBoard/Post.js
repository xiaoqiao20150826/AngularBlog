/**
 * 
 */
//TODO: BoardPost가 적절한데.
/* 참조 및 초기화 */

var H = require('../../common/helper.js')
  , _ = require('underscore')
  , pathUtil = require('../../common/util/pathUtil')
  
var User = require('../User.js')
  

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
Post.getCategoryIds = function (posts) {
	var result = [];
	var key = 'categoryId';
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

Post.prototype.addFilePath = function (filePaths) {
	if(!_.isArray(filePaths)) filePaths = [filePaths]
	this.filePaths = filePaths;
};
// update를 위해 [a,b,c] -> 'urlA;urlB;urlC;'
Post.prototype.getFileNames = function (filePath) {
	var filePaths = this.filePaths
	if(!_.isArray(filePaths)) filePaths = [filePaths]
	
	var fileNames=[]
	for(var i in filePaths) {
		var filePath = filePaths[i]
		  , fileName = pathUtil.getFileName(filePath)
		  
		  fileNames.push(fileName)
	}
	
	return fileNames
}
Post.prototype.getUrlStringsOfFile = function () {
	var filePaths = this.filePaths
	if(!_.isArray(filePaths)) filePaths = [filePaths]
	var urlStrings = ''
	for(var i in filePaths) {
		var filePath = filePaths[i]
		  , url = pathUtil.getUrlByLocalFilePath(filePath)
		  
		  urlStrings =  urlStrings +  ';' + url
	}
	if(urlStrings.charAt(0) == ';') {urlStrings = urlStrings.slice(1)}
	return urlStrings
}

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