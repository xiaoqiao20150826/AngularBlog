
/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:route:blog')
var _ = require('underscore')
  , Q = require('q')
var H = require('../../common/helper.js')
  , Done = H.Done
  , pathUtil = require('../../common/util/pathUtil')
  
var requestParser = require('../util/requestParser.js')
  , Cookie = require('../util/Cookie.js')
  , Redirector = require('../util/Redirector.js')
  , scriptletUtil = require('../../common/util/scriptletUtil.js')
  
var Post = require('../../domain/blogBoard/Post.js')
  , Category = require('../../domain/blogBoard/Category')
  , blogService = require('../../service/blogBoard/blogBoardService')
  , categoryService = require('../../service/blogBoard/categoryService')

var _config;
var FIRST_PAGE_NUM = 1
  , SORTER_NEWEST = 'newest'

var blogBoardController = module.exports = {}
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
blogBoardController.mapUrlToResponse = function(app) {

		// 사용자를 위한 북마커블한 url
		app.get('/blog/history', this.sendHistoryView);
//		
		//ajax or 북마커블하지 않은 url.
		app.post('/blog/new', this.sendInsertView);
//		app.get('/blog/delete', this.deletePostOrFile);
		app.post('/blog/history', this.sendHistoryView4ajax)
	
		// detail
		app.get('/blog/:postNum(\\d+)', this.detailView);
		app.get('/blog/:postNum(\\d+)/:title', this.detailView);
		app.post('/blog/:postNum(\\d+)', this.detailView4ajax);
		app.post('/blog/:postNum(\\d+)/:title', this.detailView4ajax);
		
//		//nav ajax위한 주소
		app.post('/blog', this.sendBlogBoardList);
		app.post('/blogBoard/List', this.sendBlogBoardList)
		app.post('/blogBoard/insert', this.insertBlogBoardData)
//		app.post('/ajax/increaseVote', this.increaseVote)
//		app.post('/ajax/blogListView', this.listView)
//		
//		//test
//		app.get('/cookie', _seeCookie);
//		app.get('/test', _test);
//		
//		//err
//		app.get('/blog/:stringParam(\\w+)', this.errPage);
//		app.get('/blog/:stringParam(\\w+)/:sfwef', this.errPage);
		//config 가져오기
		_config = app.get('config');
}	
	
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
blogBoardController.sendBlogBoardList = function (req, res) {
 		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		  , pageNum = _.isEmpty(rawData.pageNum) ? FIRST_PAGE_NUM : rawData.pageNum  
		  , sorter = _.isEmpty(rawData.sorter) ? SORTER_NEWEST: rawData.sorter
		  , categoryId = Category.isRoot(rawData.categoryId) ? Category.getRootId() : rawData.categoryId
		  , loginUser = requestParser.getLoginUser(req)
		
		debug('list rawData ',rawData)  
		var errFn = redirector.catch;
		H.call4promise(blogService.getFullList, pageNum, sorter, categoryId)
         .then(function dataFn(args) {
           	var posts = args.posts
           	  , pager = args.pager.make4view(pageNum)

  			var blog = {posts : posts
  					  , pager : pager
  					  , loginUser : loginUser 
  					  , scriptletUtil : scriptletUtil
  					  };
  			
  			res.render('./centerFrame/blogBoard/list.ejs', {blog : blog});
  		})
         .catch(errFn)
}
blogBoardController.sendInsertView = function(req,res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	
	if(loginUser.isNotExist()) return redirector.main();
	
	H.call4promise(categoryService.getRootOfCategoryTree)
	 .then(function (rootOfCategoryTree) {
		 	var blog = { loginUser: loginUser
		 			   , rootOfCategoryTree : rootOfCategoryTree
		 			   , scriptletUtil : scriptletUtil
		 			   };
		 	
			return res.render('./centerFrame/blogBoard/post/insert.ejs', { blog : blog} );
	 })
	 .catch(redirector.catch)
}
blogBoardController.detailView = function(req, res) {
	_detailView(req,res,'./wholeFrame/blogBoard/detail.ejs')
}
blogBoardController.detailView4ajax = function(req, res) {
	_detailView(req,res,'./centerFrame/blogBoard/detail.ejs')
}
function _detailView(req, res, viewPath) {
	var redirector = new Redirector(res)
	var rawData = requestParser.getRawData(req)
	  , postNum = rawData.postNum
	  , loginUser = requestParser.getLoginUser(req)
	  , cookie = new Cookie(req, res);
	
	var errFn = redirector.catch;
	H.all4promise([
	               	  [blogService.increaseReadCount, postNum, cookie]
	               	, [blogService.getJoinedPost, postNum]
	               	, [categoryService.getRootOfCategoryTree]
	])
	 .then(function dataFn(args) {
		 var joinedPost = args[1]
		 if(joinedPost.isEmpty()) return redirector.main() 
		
		 var rootOfCategoryTree = args[2]
		 var blog = { loginUser : loginUser
				    , post : joinedPost
				    , rootOfCategoryTree : rootOfCategoryTree
		 			, scriptletUtil : scriptletUtil
		 			}
		 
		 res.render(viewPath,{blog : blog} )
	 })
	 .catch(errFn);
}
blogBoardController.insertBlogBoardData = function(req,res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , userId = rawData.userId
	  , filePath = pathUtil.getLocalFilePathByUrl(rawData.fileUrl) 
	var post = Post.createBy(rawData)
	post.addFilePath(filePath);

	debug('insertPost reqData : ', rawData)
	if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return redirector.main()
	
	blogService.insertPostAndIncreaseCategoryCount(new Done(dataFn, redirector.catch), post);
	function dataFn(insertedPost) {
//		var postNum = insertedPost.num;
//		redirector.post(postNum)
		debug('insertedPost : ', insertedPost)
		redirector.main()
	}
}
//	deletePostOrFile : function (req, res) {
//		var redirector = new Redirector(res)
//		var loginUser = requestParser.getLoginUser(req)
//		  , rawData = requestParser.getRawData(req)
//		  , userId = rawData.userId
//		  , postNum = rawData.postNum
//	      , filepath = rawData.filepath;
//	      
//		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return redirector.main()
//		
//		if(_.isEmpty(filepath)) filepath = null;  // ''가 전달될 경우
//		
//		blogService.deletePostOrFile(new Done(dataFn, redirector.catch), postNum, filepath);
//		function dataFn() {
//			redirector.main()
//		 }
//	},
//	increaseVote : function (req, res) {
//		var redirector = new Redirector(res)
//		var rawData = requestParser.getRawData(req)
//		  , postNum = rawData.postNum
//		  , userId = rawData.userId
//		  , loginUser = requestParser.getLoginUser(req)
//		  , loginUserId = loginUser._id;
//		
//		if(loginUser.isNotExist() ) return res.send('must login');
//		
//		blogService.increaseVote(new Done(dataFn, redirector.catch), postNum, loginUserId);
//		function dataFn(status) {
//			res.send(status.message);
//		 }
//	},
blogBoardController.sendHistoryView4ajax = function (req, res) {
	_sendHistoryView(req, res, './centerFrame/blogBoard/history.ejs')
}
blogBoardController.sendHistoryView = function (req, res) {
	_sendHistoryView(req, res, './wholeFrame/blogBoard/history.ejs')
}
function _sendHistoryView(req, res, viewPath) {
		var redirector = new Redirector(res)		
		var loginUser = requestParser.getLoginUser(req);
		
		H.all4promise([
		                 [blogService.findGroupedPostsByDate]
		               , [categoryService.getRootOfCategoryTree] 
        ])
         .then(function dataFn(args) {
 			var groupedPostsByDate = args[0]
			  , rootOfCategoryTree = args[1]
			
			var blog = { loginUser : loginUser
					   , groupedPostsByDate : groupedPostsByDate
	  				   , rootOfCategoryTree : rootOfCategoryTree
					   , _ : _
					   , H : H
					   , scriptletUtil : scriptletUtil 
					   }
			res.render(viewPath, {blog : blog});
 			return;
		})
		 .catch(redirector.catch)
}
//	
//	errPage : function(req, res) {
//		var redirector = new Redirector(res)
//		var rawData = requestParser.getRawData(req)
//		redirector.catch(rawData);
//	}
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