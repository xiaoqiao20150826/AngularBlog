/* 초기화 및 클래스 변수 */
var H = require('../common/helper.js')
  , User = require('../domain/User')
  , userDAO = require('../dao/userDAO')
  , blogService = require('../services/blogService');

var MAIN_PAGE_INDEX = 1;

var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//temp..rest로변경해야함.
		app.get('/', this.main);
		app.get('/detail', this.detail); 
		app.get('/list', this.list); 
		app.get('/insert', this.insert); 
	},	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
	main : function(req, res) {
		var pageNum = req.query.page;
		if(!(H.exist(pageNum))) pageNum = MAIN_PAGE_INDEX;
		var loginId = req.session.passport.user;
		
		console.log(JSON.stringify(req.session))
		blogService.getBlogBy(new H.Done(dataFn, errFn1(res)), pageNum, loginId)
		function dataFn(blog) {
			console.log(blog);
			res.render('./main.ejs',{blog: blog});
		}
		
	},
	detail : function(req, res) {
		res.render('./blog/detail.ejs');
	},
	list : function(req,res) {
		res.render('./blog/list.ejs');
	},
	insert : function(req,res) {
		var loginId = req.session.passport.user;
//		  , userIdOfPost = req.body.userId;
		
		if(H.exist(loginId))
			return res.render('./blog/insert.ejs',{loginId:loginId});
		else
			return res.send('need sign in');
	}
};

function errFn1(res) {
	return function(err) {
		res.send(new Error('err : '+err).stack)
	}
}