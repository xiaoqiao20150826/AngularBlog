
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , fsHelper = require('../common/fsHelper.js')
  , boardService = require('../services/boardService')
  , blogService = require('../services/blogService');


var MAIN_PAGE_INDEX = 1;

var _config
var board = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//temp..rest로변경해야함.
		app.get('/board/detail', this.detail); 
		app.get('/board', this.list); 
		app.get('/board/new', this.insertView); 
		app.get('/board/delete', this.delete);
		app.post('/board', this.insert);
		app.post('/answer', this.insertAnswer);
		
		//config 가져오기
		_config = app.get('config');
	},	
	
	detail : function(req, res) {
		var postNum = req.query.postNum;
		var loginedId = req.session.passport.user;
		
		blogService.getBlogOfDetail(new H.Done(dataFn, catch1(res)), postNum, loginedId);
		function dataFn(blog) {
			res.render('./blog/detail.ejs',{blog: blog});
		}
	},
	list : function(req,res) {
		var pageNum = req.query.pageNum;
		if(!(H.exist(pageNum))) pageNum = MAIN_PAGE_INDEX;
		boardService.getBoardByPageNum(new H.Done(dataFn, catch1(res)), pageNum);
		
		function dataFn(board) {
			res.render('./blog/list.ejs',{board: board});
		}
	},
	insertView : function(req,res) {
		var loginedId = req.session.passport.user;
		if(loginedId)
			return res.render('./blog/insert.ejs', {loginId:loginedId});
		else
			return res.send('need sign in');
	},
	insert : function(req,res) {
		var postData = req.body
		  , file = _.toArray(req.files).pop(); //현재하나뿐.
		
		boardService.insertPost(new Done(dataFn, catch1(res)), postData, file);
		function dataFn(insertedPost) {
			 res.redirect('/') 
		 }
	},
	insertAnswer : function(req, res) {
		var answerData = req.body;
		
		boardService.insertAnswer(new H.Done(dataFn, catch1(res)), answerData);
		function dataFn(answer) {
			console.log(answer);
			res.redirect('/board/detail?postNum='+answer.postNum);
		}
	},
	delete : function (req, res) {
		//TODO: 로그인한 유저와 일치한지 체크할것. 
		var postNum = req.query.postNum;
		var filepath = req.query.filepath;
		boardService.deleteBy(new Done(dataFn, catch1(res)), postNum, filepath);
		
		function dataFn() {
			 res.redirect('/board') 
		 }
	}
};
/*    helper   */
//test
function catch1(res) {
	return function(err) {
		res.send(new Error(err))
	}
}
