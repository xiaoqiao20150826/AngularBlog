/* 초기화 및 클래스 변수 */
var H = require('../common/helper.js')
	,_service = require('../services/blogService');
var MAIN_PAGE_INDEX = 1;

var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		app.get('/', this.list);
		app.get('/login', this.login);
		app.get('/detail', this.detail); //temp..rest로변경해야함.
	},	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */		
	list : function(req, res) {
		var page = req.query.page;
		if(!(H.exist(page))) page = MAIN_PAGE_INDEX;
		var datas = _service.datasOfPageNum(page);
		res.render('./blog/list.ejs', {datas: datas});
	},
	detail : function(req,res) {
		res.render('./blog/detail.ejs');
	},
	login : function(req,res) {
		res.render('./blog/login.ejs');
	}
};
