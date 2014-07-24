
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , Answer = require('../domain/Answer.js')
  , answerService = require('../services/answerService.js');

var _config;
var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//temp..rest로변경해야함.
		app.post('/answer', this.insert);
		
		//config 가져오기
		_config = app.get('config');
	},	
	
	insert : function(req, res) {
		var answerData = req.body
		  , postNum = answerData.postNum
		  , answerNum = answerData.answerNum;
		
		//TODO: 현재 deep 값을 받아오지 않는다. 2단 코멘트만 하는중.
		console.log('answerNum', answerNum, isFirstLevelAnswer(answerNum));
		if(isFirstLevelAnswer(answerNum)) 
			return answerService.insertAnswer(new H.Done(dataFn, catch1(res)), answerData);
		else
			return answerService.insertAnswerWithIncresedDeep(new H.Done(dataFn, catch1(res)), answerData);
		
		function dataFn(answer) {
			res.redirect('/blog/'+postNum);
		}
	}
};
function isFirstLevelAnswer(answerNum) {
	if(!(answerNum > 0)) return true
	else return false; 
}
/*    helper   */
function catch1(res) {
	return function(err) {
		res.send(new Error('err : '+err).stack)
	}
}
