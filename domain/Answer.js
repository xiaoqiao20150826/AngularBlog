
/* 참조 및 초기화 */
var H = require('../common/helper.js');

//////////////////
var Answer = module.exports = function Answer() {
	var o = Answer.getSchema();
	for(var key in o) {
		this[key] = null;
	}
	this.created = Date.now();
	this.vote = 0;
	this.deep = 1;
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
var lowEmptyAnswer = null; 
Answer.getEmptyLowAnswer = function () {
	if(lowEmptyAnswer == null) {
		lowEmptyAnswer = new Answer();
		lowEmptyAnswer.created = '';
		lowEmptyAnswer.deep = 2;
	}
	return lowEmptyAnswer;
}

Answer.getSchema = function () {
	return {
        'num' : Number,
        'created' : Date,
        'vote' : Number,
        'image' : String,
        'content' : String,
        'userId' : String,
        'postNum' : Number,
        'answerNum' : Number,
        'deep' : Number
		};
};


/* instance method */
Answer.prototype.setUser = function(user) {
	this.user = user;
}
Answer.prototype.setAnswers = function(answers) {
	this.answers = answers;
}
/* helper */
