
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , reqParser = require('./common/reqParser.js')
  , checker = require('./common/checker.js')
  , fsHelper = require('../common/fsHelper.js')
  , Post = require('../domain/Post.js')
  , blogService = require('../services/blogService');

var _config;
var FIRST_PAGE_NUM = 1;
var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//TODO: 순서 주의. 두번째 arg가 string을 먼저 구분한뒤 숫자형을 받아야함..
		app.get('/', this.listView);
		app.get('/blog', this.listView);
		app.post('/blog', this.insertPost);
		app.get('/test', _test);
		
		app.get('/blog/new', this.insertView);
		app.get('/blog/delete', this.deletePostOrFile);
		
		app.get('/blog/:postNum(\\d+)', this.detailView);
		app.get('/blog/:postNum(\\d+)/:title', this.detailView);
		app.get('/blog/:stringParam(\\w+)', this.errPage);
		app.get('/blog/:stringParam(\\w+)/:sfwef', this.errPage);
		
		
		
		//config 가져오기
		_config = app.get('config');
	},	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
	listView : function(req, res) {
		var rawData = reqParser.getRawData(req)
		  , pageNum = rawData.pageNum
		  , loginUser = reqParser.getLoginUser(req);
		
		if(!(H.exist(pageNum))) pageNum = FIRST_PAGE_NUM;
		
		blogService.getPostsAndPager(new H.Done(dataFn, catch1(res)), pageNum)
		function dataFn(result) {
			var blog = {posts : result.posts
					  , pager : result.pager
					  , loginUser : loginUser };
			res.render('./blog/list.ejs', {blog : blog});
		}
	},
	insertView : function(req,res) {
		var loginUser = reqParser.getLoginUser(req)
		  , blog = {loginUser: loginUser};
		
		if(loginUser)
			return res.render('./blog/insert.ejs', {blog: blog});
		else
			return res.send('need sign in');
	},
	detailView : function(req, res) {
		var rawData = reqParser.getRawData(req)
		  , postNum = rawData.postNum
		  , loginUser = reqParser.getLoginUser(req);
		
		req.header
		
		var test = [11,22,333,4444,555];
		res.cookie('test', test);
		
		blogService.getJoinedPost(new H.Done(dataFn, catch1(res)), postNum);
		function dataFn(joinedPost) {
			if(joinedPost.isEmpty()) return res.redirect('/blog'); 
			
			var blog = {loginUser : loginUser, post : joinedPost}
			res.render('./blog/detail.ejs',{blog : blog});
		}
	},
	insertPost : function(req,res) {
		var rawData = reqParser.getRawData(req)
		  , post = Post.createBy(rawData)
		  , file = _.toArray(req.files).pop(); //TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감
		
		if(checker.isNotAuthorizedAbout(req)) return _redirectCurrentPost(rawData, res)
		
		blogService.insertPostWithFile(new Done(dataFn, catch1(res)), post, file);
		function dataFn(insertedPost) {
			_redirectCurrentPost(rawData, res)
		}
	},
	deletePostOrFile : function (req, res) {
		var rawData = reqParser.getRawData(req)
		  , postNum = rawData.postNum
	      , filepath = rawData.filepath;
	      
		if(checker.isNotAuthorizedAbout(req)) return _redirectCurrentPost(rawData, res)
		
		if(_.isEmpty(filepath)) filepath = null;  // ''가 전달될 경우
		
		blogService.deletePostOrFile(new Done(dataFn, catch1(res)), postNum, filepath);
		function dataFn() {
			res.redirect('/');
		 }
	},
	errPage : function(req, res) {
		var rawData = reqParser.getRawData(req)
		res.send('not bind url : ',"not bind url" +JSON.stringify(rawData));
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
function _redirectCurrentPost(rawData, res) {
	var postNum = rawData.postNum || rawData.num || null;
	
	if(postNum) return res.redirect('/blog/'+postNum);
	else return res.redirect('/')
}
function catch1(res) {
	return function(err) {
		res.send(new Error(err));
	}
}
