
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
};

/* static method */
// 생성자
/* 생성자 */
Answer.createBy= function(model) {
	return H.createTargetFromSources(Answer, model, function(answer) {
		if(!(H.exist(answer.userId))) answer.userId = 'annoymous';
	});
};

Answer.getSchema = function () {
	return {
        'num' : Number,
        'created' : Date,
        'vote' : Number,
        'image' : String,
        'content' : String,
        'userId' : String,
        'postNum' : Number
		};
};
/* instance method */

/* helper */
