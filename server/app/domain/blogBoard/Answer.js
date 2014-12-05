
/* 참조 및 초기화 */
var _ = require('underscore')
var H = require('../../common/helper.js')

var User = require('../User.js')
//////////////////
var Answer = module.exports = function Answer() {
	this._id = null 
    this.num = 0
    this.created= Date.now();
    this.content = ''
    this.userId = User.ANNOYMOUS_ID;
    this.writer = ''
    this.postNum = 0
    this.answerNum = 0
    this.password = ''
};

/* static method */
/* 생성자 */
Answer.createBy= function(model) {
	if(model == null) 
		return new Answer(); 
	else 
		return H.createTargetFromSources(Answer, model)
};

Answer.getAnswerNums = function (answers) {
	var result = [];
	var key = 'num'; //이 키를 가져오지만 상대에게는 answerNum이맞음
	for(var i in answers) {
		var answer = answers[i];
		if(H.exist(answer[key])) {
			result.push(answer[key]);
		}
	}
	return result;
}
Answer.getUserIds = function (answers) {
	var result = [];
	var key = 'userId'; 
	for(var i in answers) {
		var answer = answers[i];
		if(H.exist(answer[key])) {
			result.push(answer[key]);
		}
	}
	return result;
}
//answers Joiner의 treeTo에 사용할 루트. 
Answer.makeRoot = function () {
	rootAnswer = new Answer();
	rootAnswer.created = '';
	rootAnswer.answers = [];
	return rootAnswer;
}


/* instance method */
Answer.prototype.setUser = function(user) {
	this.user = user;
}
Answer.prototype.setAnswers = function(answers) {
	this.answers = answers;
}
//writer가있으면. exist.. '' 포함되었던가.?
Answer.prototype.isAnnoymous = function() {
	if(H.exist(this.writer) || this.userId == User.ANNOYMOUS_ID) return true;
	else return false;
}
Answer.prototype.hasNotData4annoymous = function () {
	if((H.notExsit(this.writer) || H.notExist(this.password)) ) return true
	else return false;
}
/* helper */