
/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:route:blog')
var _ = require('underscore')
  , Q = require('q')
var H = require('../common/helper.js')

var requestParser = require('./common/requestParser.js')
  , Cookie = require('./common/Cookie.js')
  , Redirector = require('./common/Redirector.js')
  , scriptletUtil = require('../common/util/scriptletUtil.js')
  
var Post = require('../domain/Post.js')
  , blogService = require('../services/blogService')
  , categoryService = require('../services/categoryService')

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
 		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		  , pageNum = rawData.pageNum
		  , sorter = rawData.sorter
		  , loginUser = requestParser.getLoginUser(req);
		
		if(!(H.exist(pageNum))) pageNum = FIRST_PAGE_NUM;
		if(!(H.exist(sorter))) sorter = SORTER_NEWEST;
		
		var errFn = redirector.catch;
		H.all4promise([  [blogService.getPostsAndPager, pageNum, sorter]
		               , [categoryService.getJoinedCategories]
		])
         .then(function dataFn(args) {
           	var postsAndPager = args[0]
  		      , joinedCategories = args[1];
  		    
  			var blog = {posts : postsAndPager.posts
  					  , pager : postsAndPager.pager
  					  , categories : joinedCategories
  					  , loginUser : loginUser 
  					  , sorter : sorter
  					  , scriptletUtil : scriptletUtil
  					  };
  			
  			res.render(toRenderView, {blog : blog});
  		})
         .catch(errFn)
	},
	insertView : function(req,res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		
		if(loginUser.isNotExist()) return redirector.main();
		
		H.call4promise(categoryService.getJoinedCategories)
		 .then(function (joinedCategories) {
			 	var blog = { loginUser: loginUser
			 			   , categories : joinedCategories
			 			   , scriptletUtil : scriptletUtil
			 			   };
			 	
				return res.render('./blog/insert.ejs', { blog : blog} );
		 })
	},
	detailView : function(req, res) {
		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		  , postNum = rawData.postNum
		  , loginUser = requestParser.getLoginUser(req)
		  , cookie = new Cookie(req, res);
		
		var errFn = redirector.catch;
		H.all4promise([
		               	  [blogService.increaseReadCount, postNum, cookie]
		               	, [blogService.getJoinedPost, postNum]
		])
		 .then(function dataFn(args) {
			 var joinedPost = args[1]
  			 if(joinedPost.isEmpty()) return redirector.main() 
			
			 var blog = { loginUser : loginUser
					    , post : joinedPost
			 			}
			 
			 res.render('./blog/detailLayout.ejs',{blog : blog} )
		 })
		 .catch(errFn);
	},
	insertPost : function(req,res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , userId = rawData.userId
		  , post = Post.createBy(rawData)
		  , file = _.first(_.toArray(req.files));//TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감

		debug('insertPost reqData : ', rawData)
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return redirector.main()
		
		blogService.insertPostWithFile(new Done(dataFn, redirector.catch), post, file);
		function dataFn(insertedPost) {
			var postNum = insertedPost.num;
			redirector.post(postNum)
		}
	},
	deletePostOrFile : function (req, res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , userId = rawData.userId
		  , postNum = rawData.postNum
	      , filepath = rawData.filepath;
	      
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return redirector.main()
		
		if(_.isEmpty(filepath)) filepath = null;  // ''가 전달될 경우
		
		blogService.deletePostOrFile(new Done(dataFn, redirector.catch), postNum, filepath);
		function dataFn() {
			redirector.main()
		 }
	},
	increaseVote : function (req, res) {
		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		  , postNum = rawData.postNum
		  , userId = rawData.userId
		  , loginUser = requestParser.getLoginUser(req)
		  , loginUserId = loginUser._id;
		
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return redirector.post(postNum);
		
		blogService.increaseVote(new Done(dataFn, redirector.catch), postNum, loginUserId);
		function dataFn(isSuccess) {
			//TODO: 성공 실패를 어떤 데이터를 보내야 할까.
			if(isSuccess != -1)
				res.send('sucess');
			else
				res.send('before you voted');
		 }
	},
	historyView : function (req, res) {
		var redirector = new Redirector(res)		
		var loginUser = requestParser.getLoginUser(req);
		blogService.findGroupedPostsByDate(new Done(dataFn, redirector.catch));
		function dataFn(groupedPostsByDate) {
			var blog = { loginUser : loginUser
					   , groupedPostsByDate : groupedPostsByDate 
					   , _ : _
					   , H : H
					   , scriptletUtil : scriptletUtil 
					   }
				res.render('./blog/history.ejs',{blog : blog});
		 }
	},
	
	errPage : function(req, res) {
		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		redirector.catch(rawData);
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
function _seeCookie(req, res) {
    res.send(req.headers);
}