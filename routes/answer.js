
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , checker = require('./common/checker.js')
  , reqParser = require('./common/reqParser.js')
  , Done = H.Done
  , Answer = require('../domain/Answer.js')
  , answerService = require('../services/answerService.js');

var _config;
var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//temp..rest로변경해야함.
		app.post('/answer', this.insert);
		app.get('/answer/delete', this.delete);
		
		//config 가져오기
		_config = app.get('config');
	}	
    , insert : function(req, res) {
		var rawData = reqParser.getRawData(req)
		  , answer = Answer.createBy(rawData);
		if(checker.isNotAuthorizedAbout(req)) return _redirectCurrentPost(rawData, res);
		
		return answerService.insertAndIncreaseCount(new H.Done(dataFn, catch1(res)), answer);
		
		function dataFn() {
			_redirectCurrentPost(rawData, res)
		}
	}
    , delete : function(req, res) {
    	var rawData = reqParser.getRawData(req)
    	  , num = rawData.num;
    	
    	if(checker.isNotAuthorizedAbout(req)) return _redirectCurrentPost(rawData, res)
    	
    	answerService.deleteAnswer(new Done(dataFn, catch1(res)), num); 
    	function dataFn() {
    		_redirectCurrentPost(rawData, res)
    	}
    }
    
    
};
/*    helper   */

function _redirectCurrentPost(rawData, res) {
	var postNum = rawData.postNum || null;
	
	if(postNum) return res.redirect('/blog/'+postNum);
	else return res.redirect('/')
}

function catch1(res) {
	return function(err) {
		res.send(new Error('err : '+err).stack)
	}
}
