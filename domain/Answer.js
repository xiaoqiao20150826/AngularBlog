
/* 참조 및 초기화 */
var H = require('../common/helper.js');

//////////////////
var Answer = module.exports = function () {
	var o = Answer.getSchema();
	for(var key in o) {
		this[key] = null;
	}
	this.created = Date.now();
	this.vote = 0;
};

/* static method */
// 생성자
Answer.createByRaw= function (raw) {
	if( !(H.exist([raw.content, raw.postNum])) ) throw 'content, postNum는 필수데이터';
	var answer = _initTargetFromSource(new Answer(), raw);
	if(!(H.exist(answer.userId))) answer.userId = 'annoymous';
	return answer;
};
// 생성자인데. 무엇을 통해 생성한다고 해야할까. DB data?  객체관계불일치...관계? 도메인...모델...모델.?
Answer.createByModel= function(answerModel) {
	var answer = _initTargetFromSource(new Answer(), answerModel);
	if(!(H.exist(answer.userId))) answer.userId = 'annoymous';
	return answer;
};
Answer.getSchema = function () {
	return {
        'num' : Number,
        'created' : Date,
        'vote' : Number,
        'image' : String,
        'content' : String,
        'userID' : String,
        'postNum' : Number
		};
};
/* instance method */

/* helper */
//target의 속성을 키로하여 source의 값을 확인한다. 
//만약 키의 값이 존재한다면 target에 값을 할당한다. 아니라면 null 할당. 
function _initTargetFromSource(target, source) {
	for(var key in target) {
		var value = source[key];
		if(H.exist(value)) {
			target[key] = value;
		} 
	}
	return target;
}
