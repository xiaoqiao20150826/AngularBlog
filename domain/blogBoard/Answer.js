
/* 참조 및 초기화 */
var _ = require('underscore')
var H = require('../../common/helper.js')

//////////////////
var Answer = module.exports = function Answer() {
	var o = Answer.getSchema();
	for(var key in o) {
		this[key] = null;
	}
	this.created = Date.now();
};

/* static method */
/* 생성자 */
Answer.createBy= function(model) {
	if(model == null) return new Answer(); 
	else return H.createTargetFromSources(Answer, model, function(answer) {
		if(!(H.exist(answer.userId))) answer.userId = 'annoymous';
	});
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
	rootAnswer.num = null;
	rootAnswer.answers = [];
	return rootAnswer;
}

Answer.getSchema = function () {
	return {
        'num' : Number,
        'created' : Date,
        'content' : String,
        'userId' : String,
        'writer' : String,
        'postNum' : Number,
        'answerNum' : Number,
        'password' : String
		};
};


/* instance method */
Answer.prototype.setUser = function(user) {
	this.user = user;
}
Answer.prototype.setAnswers = function(answers) {
	this.answers = answers;
}
//writer가있으면.
Answer.prototype.isAnnoymous = function() {
	if(H.exist(this.writer)) return true;
	else return false;
}
Answer.prototype.hasNotData4annoymous = function () {
	if(!(H.exist(this.writer) || H.exist(this.password)) ) return true
	else return false;
}
/* helper */