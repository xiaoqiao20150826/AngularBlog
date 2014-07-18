
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , fsHelper = require('../common/fsHelper.js')
  , blogService = require('../services/blogService');

var MAIN_PAGE_INDEX = 1;

var _config;
var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//temp..rest로변경해야함.
		app.get('/', this.main);
		app.get('/test', _test);
		
		//config 가져오기
		_config = app.get('config');
	},	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
	main : function(req, res) {
		var pageNum = req.query.page;
		if(!(H.exist(pageNum))) pageNum = MAIN_PAGE_INDEX;
		var loginId = req.session.passport.user;
		
		blogService.getBlogBy(new H.Done(dataFn, catch1(res)), pageNum, loginId)
		function dataFn(blog) {
			res.render('./main.ejs',{loginUser : blog.loginUser, board : blog.board});
		}
		
	}
};
/*    helper   */
//test
function _test(req, res) {
	req.session.passport.user = '6150493-github';
	res.redirect('/');
}
function catch1(res) {
	return function(err) {
		res.send(new Error('err : '+err).stack)
	}
}
//
//function getLoginedId(req) {
//	var loginId = req.session.passport.user;
//	if(H.exist(loginId)) 
//		return loginId;
//	else 
//		return null;
//}