
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , fsHelper = require('../common/fsHelper.js')
  , Blog = require('../domain/Blog.js')
  , blogService = require('../services/blogService');

var MAIN_PAGE_INDEX = 1;

var _config;
var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//TODO: 순서 주의. 두번째 arg가 string을 먼저 구분한뒤 숫자형을 받아야함..
		app.get('/', this.listView);
		app.get('/blog', this.listView);
		app.post('/blog', this.insertPost);
		app.get('/blog/new', this.insertView);
		app.get('/blog/delete', this.deletePostAndFile);
		app.get('/blog/:postNum', this.detailView);
		app.get('/blog/:postNum/:title', this.detailView);
		
		app.get('/test', _test);
		
		//config 가져오기
		_config = app.get('config');
	},	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
	listView : function(req, res) {
		var pageNum = req.query.pageNum;
		if(!(H.exist(pageNum))) pageNum = MAIN_PAGE_INDEX;
		
		var loginUser = req.session.passport.user || null;
		
		blogService.getPostsAndPager(new H.Done(dataFn, catch1(res)), pageNum)
		function dataFn(result) {
			var blog = {posts : result.posts
					  , pager : result.pager
					  , loginUser : loginUser };
			res.render('./blog/list.ejs', {blog : blog});
		}
	},
	insertView : function(req,res) {
		var loginUser = req.session.passport.user || null;
		var blog = {loginUser: loginUser};
		if(loginUser)
			return res.render('./blog/insert.ejs', {blog: blog});
		else
			return res.send('need sign in');
	},
	detailView : function(req, res) {
		var postNum = req.params.postNum;
		var loginUser = req.session.passport.user || null;
		
		blogService.getRealPost(new H.Done(dataFn, catch1(res)), postNum);
		function dataFn(realPost) {
			var blog = {loginUser : loginUser, post : realPost}
			res.render('./blog/detail.ejs',{blog : blog});
		}
	},
	insertPost : function(req,res) {
		var postData = req.body
		, file = _.toArray(req.files).pop(); //현재하나뿐. 파일업로드 안해도 빈거들어감
		
		blogService.insertPostWithFile(new Done(dataFn, catch1(res)), postData, file);
		function dataFn(insertedPost) {
			res.redirect('/') 
		}
	},
	deletePostAndFile : function (req, res) {
		//TODO: 로그인한 유저와 일치한지 체크할것.
		var postNum = req.query.postNum
		  , filepath = req.query.filepath;
		if(_.isEmpty(filepath)) filepath = null;  // ''가 전달될 경우
		
		blogService.deletePostAndFile(new Done(dataFn, catch1(res)), postNum, filepath);
		function dataFn() {
			 res.redirect('/'); 
		 }
	}
};
/*    helper   */
//test
function _test(req, res) {
	req.session.passport.user = {_id: '6150493-github'
		                       , name: 'kangil'
		                       , photo: 'https://avatars.githubusercontent.com/u/6150493'
		                       , email: 'ee@dd.com'
		                    	 };
	res.redirect('/');
}
function catch1(res) {
	return function(err) {
		res.send(new Error(err));
	}
}
