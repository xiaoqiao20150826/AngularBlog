
/* 초기화 및 클래스 변수 */
var _ = require('underscore');

var H = require('../common/helper.js')
  , reqParser = require('./common/reqParser.js')
  , Cookie = require('./common/Cookie.js')
  , Post = require('../domain/Post.js')
  , blogService = require('../services/blogService');

var _config;
var FIRST_PAGE_NUM = 1
  , SORTER_NEWEST = 'newest';

var blog = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
		//TODO: 순서 주의. 두번째 arg가 string을 먼저 구분한뒤 숫자형을 받아야함..
		app.get('/', this.listLayoutView);
		app.get('/blog', this.listLayoutView);
		app.post('/blog', this.insertPost);
		
		
		app.get('/blog/new', this.insertView);
		app.get('/blog/delete', this.deletePostOrFile);
		app.get('/blog/history', this.historyView);
		
		app.get('/blog/:postNum(\\d+)', this.detailView);
		app.get('/blog/:postNum(\\d+)/:title', this.detailView);
		
		app.post('/ajax/increaseVote', this.increaseVote)
		app.post('/ajax/blogListView', this.listView)
		
		//test
		app.get('/cookie', _seeCookie);
		app.get('/test', _test);
		
		//err
		app.get('/blog/:stringParam(\\w+)', this.errPage);
		app.get('/blog/:stringParam(\\w+)/:sfwef', this.errPage);
		//config 가져오기
		_config = app.get('config');
	},	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
	listLayoutView : function(req, res) {
		var toRenderView = './blog/listLayout.ejs'
			blog._getBlogListAndRenderTo(req, res, toRenderView)
	},
	listView : function (req, res) {
		var toRenderView = './blog/list.ejs'
			blog._getBlogListAndRenderTo(req, res, toRenderView)
	},
	_getBlogListAndRenderTo : function (req, res, toRenderView) {
		var rawData = reqParser.getRawData(req)
		  , pageNum = rawData.pageNum
		  , sorter = rawData.sorter
		  , loginUser = reqParser.getLoginUser(req);
		if(!(H.exist(pageNum))) pageNum = FIRST_PAGE_NUM;
		if(!(H.exist(sorter))) sorter = SORTER_NEWEST;
		
		blogService.getPostsAndPager(new H.Done(dataFn, catch1(res)), pageNum, sorter)
		function dataFn(result) {
			var blog = {posts : result.posts
					  , pager : result.pager
					  , loginUser : loginUser 
					  , sorter : sorter
					  };
			res.render(toRenderView, {blog : blog});
		}
	},
	insertView : function(req,res) {
		var loginUser = reqParser.getLoginUser(req)
		  , blog = {loginUser: loginUser};
		
		if(loginUser.isExist(req))
			return res.render('./blog/insert.ejs', {blog: blog});
		else
			return res.send('need sign in');
	},
	detailView : function(req, res) {
		var rawData = reqParser.getRawData(req)
		  , postNum = rawData.postNum
		  , loginUser = reqParser.getLoginUser(req)
		  , cookie = new Cookie(req, res);
		var errFn = catch1(res);
		
		H.call4promise(blogService.increaseReadCount, postNum, cookie)
		 .then(function() {
			 blogService.getJoinedPost(new H.Done(dataFn, errFn), postNum);
				function dataFn(joinedPost) {
					if(joinedPost.isEmpty()) return res.redirect('/blog'); 
					
					var blog = {loginUser : loginUser, post : joinedPost}
					res.render('./blog/detailLayout.ejs',{blog : blog});
				}
		 })
		 .catch(errFn);
	},
	insertPost : function(req,res) {
		var loginUser = reqParser.getLoginUser(req)
		  , rawData = reqParser.getRawData(req)
		  , userId = rawData.userId
		  , post = Post.createBy(rawData)
		  , file = _.first(_.toArray(req.files));//TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감
		
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectCurrentPost(rawData, res)
		
		blogService.insertPostWithFile(new Done(dataFn, catch1(res)), post, file);
		function dataFn(insertedPost) {
			_redirectCurrentPost(rawData, res)
		}
	},
	deletePostOrFile : function (req, res) {
		var loginUser = reqParser.getLoginUser(req)
		  , rawData = reqParser.getRawData(req)
		  , userId = rawData.userId
		  , postNum = rawData.postNum
	      , filepath = rawData.filepath;
	      
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectCurrentPost(rawData, res)
		
		if(_.isEmpty(filepath)) filepath = null;  // ''가 전달될 경우
		
		blogService.deletePostOrFile(new Done(dataFn, catch1(res)), postNum, filepath);
		function dataFn() {
			res.redirect('/');
		 }
	},
	increaseVote : function (req, res) {
		var rawData = reqParser.getRawData(req)
		  , postNum = rawData.postNum
		  , userId = rawData.userId
		  , loginUser = reqParser.getLoginUser(req)
		  , loginUserId = loginUser._id;
		
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectCurrentPost(rawData, res);
		
		blogService.increaseVote(new Done(dataFn, catch1(res)), postNum, loginUserId);
		function dataFn(isSuccess) {
			//TODO: 성공 실패를 어떤 데이터를 보내야 할까.
			if(isSuccess != -1)
				res.send('sucess');
			else
				res.send('before you voted');
		 }
	},
	historyView : function (req, res) {
		var loginUser = reqParser.getLoginUser(req);
		blogService.findGroupedPostsByDate(new Done(dataFn, catch1(res)));
		function dataFn(groupedPostsByDate) {
			var blog = { loginUser : loginUser
					   , groupedPostsByDate : groupedPostsByDate 
					   , _ : _
					   , H : H
					   }
				res.render('./blog/history.ejs',{blog : blog});
		 }
	},
	
	errPage : function(req, res) {
		var rawData = reqParser.getRawData(req)
		res.send('not bind url : ',"not bind url" +JSON.stringify(rawData));
	}
};
/*    helper   */
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
//test
function _test(req, res) {
	req.session.passport.user = {_id: '6150493-github'
		                       , name: 'kangil'
		                       , photo: 'https://avatars.githubusercontent.com/u/6150493'
		                       , email: 'ee@dd.com'
		                    	 };
	res.redirect('/');
}
function _seeCookie(req, res) {
    res.send(req.headers);
}