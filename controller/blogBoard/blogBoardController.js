

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
  
var postDAO = require('../../dao/blogBoard/postDAO')
  
var blogBoardService = require('../../service/blogBoard/blogBoardService')
  , categoryService = require('../../service/blogBoard/categoryService')

var FIRST_PAGE_NUM = 1
  , SORTER_NEWEST = 'newest'

var blogBoardController = module.exports = {}
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
blogBoardController.mapUrlToResponse = function(app) {

		// 사용자를 위한 url
		app.get('/blog/history', this.sendHistoryView);
		app.get('/blog/:postNum(\\d+)', this.detailView);
		app.get('/blog/:postNum(\\d+)/:title', this.detailView);
		
//		
		// ajax 

		app.post('/blog/history', this.sendHistoryView4ajax)
	
		// detail
		app.post('/blog/:postNum(\\d+)', this.detailView4ajax);
		app.post('/blog/:postNum(\\d+)/:title', this.detailView4ajax);

		app.post('/blog', this.sendBlogBoardList);
		app.post('/blogBoard/List', this.sendBlogBoardList)
		
		app.post('/blogBoard/insertView', this.sendInsertView);
		app.post('/blogBoard/insert', this.insertBlogBoardData)
		
		app.post('/blogBoard/updateView', this.sendUpdateView);
		app.post('/blogBoard/update', this.updateBlogBoardData)
		
		app.post('/blogBoard/increaseVote', this.increaseVote)
//		
		app.post('/blogBoard/delete', this.deletePost);
//		//err
//		app.get('/blog/:stringParam(\\w+)', this.errPage);
//		app.get('/blog/:stringParam(\\w+)/:sfwef', this.errPage);
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
		H.call4promise(blogBoardService.getFullList, pageNum, sorter, categoryId)
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
	
	if(loginUser.isAnnoymous()) return redirector.main();
	
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
blogBoardController.sendUpdateView = function(req,res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , postNum = rawData.postNum
	
	if(loginUser.isAnnoymous()) return redirector.main(); //TODO:writer 일치 체크해야함
	
	H.all4promise([ [categoryService.getRootOfCategoryTree]
	              , [postDAO.findByNum, postNum]
	              ])
	.then(function (args) {
		var rootOfCategoryTree = args[0]
		  , post = args[1]
		
		var blog = { loginUser: loginUser
				   , post : post
				   , rootOfCategoryTree : rootOfCategoryTree
				   , scriptletUtil : scriptletUtil
		};
		
		return res.render('./centerFrame/blogBoard/post/update.ejs', { blog : blog} );
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
	               	  [blogBoardService.increaseReadCount, postNum, cookie]
	               	, [blogBoardService.getJoinedPost, postNum]
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
	if(loginUser.isNotEqualById(userId)) return redirector.main()
	
	blogBoardService.insertPostAndIncreaseCategoryCount(new Done(dataFn, redirector.catch), post);
	function dataFn(insertedPost) {
//		var postNum = insertedPost.num;
//		redirector.post(postNum)
		debug('insertedPost : ', insertedPost)
		redirector.main()
	}
}
blogBoardController.updateBlogBoardData = function(req,res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	, rawData = requestParser.getRawData(req)
	, userId = rawData.userId
	, filePath = pathUtil.getLocalFilePathByUrl(rawData.fileUrl)
	, originCategoryId = rawData.originCategoryId
	
	var post = Post.createBy(rawData)
	post.addFilePath(filePath);
	
	debug('updatePost reqData : ', rawData)
	if(loginUser.isNotEqualById(userId)) return redirector.main()
	
	blogBoardService.updatePostAndCategoryId(new Done(dataFn, redirector.catch), post, originCategoryId);
	function dataFn(insertedPost) {
//		var postNum = insertedPost.num;
//		redirector.post(postNum)
		debug('updatePost : ', insertedPost)
		redirector.main()
	}
}
//post와 관련된것도 다삭제해.
blogBoardController.deletePost = function (req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , writerId = rawData.writerId
	  , postNum = rawData.postNum
      
	if(loginUser.isNotEqualById(writerId)) return res.send(Status.makeError(writerId + ' can not delete this post'))
		
	blogBoardService.deletePost(new Done(dataFn, redirector.catch), postNum);
	function dataFn(status) {
		//TODO:에러 상태라면. 지운데이터 되돌리기라는 등의 처리를 해야할까?
		return res.send(status.getMessage())
	 }
}
blogBoardController.increaseVote = function (req, res) {
	var redirector = new Redirector(res)
	var rawData = requestParser.getRawData(req)
	  , postNum = rawData.postNum
	  , loginUser = requestParser.getLoginUser(req)
	  , loginUserId = loginUser._id;
	
	if(loginUser.isAnnoymous() ) return res.send('must login');
	
	blogBoardService.increaseVote(new Done(dataFn, redirector.catch), postNum, loginUserId);
	function dataFn(status) {
		res.send(status.message);
	 }
}
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
		                 [blogBoardService.findGroupedPostsByDate]
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