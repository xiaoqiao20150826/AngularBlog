
/* 초기화 및 클래스 변수 */
var _ = require('underscore')
  , debug = require('debug')('route:answer')

var H = require('../common/helper.js')
  , requestParser = require('./common/requestParser.js')
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
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , userId = rawData.userId
		  , answer = Answer.createBy(rawData);
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectCurrentPost(rawData, res);
		
		debug('to create answer for rawData',rawData)
		debug('to insert answer at route(answer)',answer)
		return answerService.insertAndIncreaseCount(new H.Done(dataFn, catch1(res)), answer);
		
		function dataFn() {
			_redirectCurrentPost(rawData, res)
		}
	}
    , delete : function(req, res) {
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , userId = rawData.userId
    	  , num = rawData.num;
    	
    	if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectCurrentPost(rawData, res);
    	
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
