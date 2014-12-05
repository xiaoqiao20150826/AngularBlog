

/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:controller:blogBoardController')

var _ = require('underscore')
  , Q = require('q')
  , H = require('../../common/helper.js')
  
var JsonResponse = require('../util/JsonResponse.js')
  , AuthRequest  = require('../util/AuthRequest.js')
  , Cookie 		 = require('../util/Cookie.js');
  
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
		// json. 
		app.get('/json/blogBoard/list'		, this.sendBlogBoardList)
		app.get('/json/blogBoard/detail'	, this.sendBlogBoardDetail)
		app.post('/json/blogBoard/insert'   , this.insertBlogBoardData)
		app.post('/json/blogBoard/update'   , this.updateBlogBoardData)
		app.post('/json/blogBoard/delete'   , this.deleteBlogBoardData)

		app.get('/json/blogBoard/post'      ,  this.sendPost)
		app.get('/json/blogBoard/history'   ,  this.sendHistory)
		
		app.post('/json/blogBoard/increaseVote', this.increaseVote)
		///////////////////////////////-----------------------------------------
//		app.get('/blog/history', this.sendHistoryView);
//		app.post('/blog/history', this.sendHistoryView4ajax)
	
		// detail
//		app.post('/blog/:postNum(\\d+)', this.detailView4ajax);
//		app.post('/blog/:postNum(\\d+)/:title', this.detailView4ajax);

		
//		app.post('/blogBoard/insertView', this.sendInsertView);
//		
//		app.post('/blogBoard/updateView', this.sendUpdateView);
//		app.post('/blogBoard/update', this.updateBlogBoardData)
//		

////		
//		app.post('/blogBoard/delete', this.deletePost);
//		//err
//		app.get('/blog/:stringParam(\\w+)', this.errPage);
//		app.get('/blog/:stringParam(\\w+)/:sfwef', this.errPage);
}	
	
/* json 응답. */
blogBoardController.sendBlogBoardList = function (req, res) {
		var jsonRes 	= new JsonResponse(res)
		  , authReq 	= new AuthRequest(req)
		
		var rawData 	= authReq.getRawData(req)
		  , pageNum 	= _.isEmpty(rawData.pageNum) ? FIRST_PAGE_NUM : rawData.pageNum  
		  , sorter 		= _.isEmpty(rawData.sorter) ? SORTER_NEWEST: rawData.sorter
		  , categoryId 	= Category.isRoot(rawData.categoryId) ? Category.getRootId() : rawData.categoryId
		  , searcher 	= _.isEmpty(rawData.searcher) ? null : rawData.searcher
		
		debug('list rawData ',rawData)  
		  
		blogBoardService.getFullList( pageNum, sorter, categoryId, searcher)
         .then(function dataFn(postsAndPager) {
  			var list = { posts : postsAndPager.posts
  					   , pager : postsAndPager.pager.make4view(pageNum)
  					   };
        	
  			return jsonRes.send(list)
  		 })
         .catch(jsonRes.catch())
}
blogBoardController.sendPost = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var rawData 	= authReq.getRawData(req)
	  , postNum 	= rawData.postNum
	
	if(_.isEmpty(postNum)) return jsonRes.sendFail(postNum + ': postNum is not exist')  
	  
	postDAO.findByNum(postNum)
		   .then(function(post) {
			   debug('send post by ' + postNum +' : ' ,post)
			   return jsonRes.send(post)
		   })
		   .catch(jsonRes.catch())
}
blogBoardController.sendBlogBoardDetail = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var rawData 	= authReq.getRawData(req)
	  , postNum 	= rawData.postNum
	  , cookie 		= new Cookie(req, res);
	
	Q.all([
	        blogBoardService.increaseReadCount( postNum, cookie)
	      , blogBoardService.getJoinedPost( postNum)
	])
	 .then(function dataFn(args) {
		 var joinedPost = args[1]
		 var detail 	= { post : joinedPost}
		 
		 return jsonRes.send(detail)
	 })
	  .catch(jsonRes.catch())
}
blogBoardController.insertBlogBoardData = function(req,res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var loginUser   = authReq.getLoginUser(req)
	var rawData 	= authReq.getRawData(req)
	  , userId 		= rawData.userId
	  , fileInfoes  = rawData.fileInfoes
			  
	var post = Post.createBy(rawData)
	post.addFileInfoes(fileInfoes);
	
	debug('insertPost reqData : ', rawData)
	if(loginUser.isNotEqualById(userId)) return jsonRes.sendFail(userId + ' is not loginUser')
	
	blogBoardService.insertPostAndIncreaseCategoryCount(post)
					.then(function(insertedPost) {
						 return jsonRes.send(insertedPost)						
					})
				    .catch(jsonRes.catch())
}
blogBoardController.updateBlogBoardData = function(req,res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var loginUser   = authReq.getLoginUser(req)
	var rawData 	= authReq.getRawData(req)
	  , userId 		= rawData.userId
	  , fileInfoes  = rawData.fileInfoes
	  , originCategoryId = rawData.originCategoryId
	
	var post = Post.createBy(rawData)
	post.addFileInfoes(fileInfoes);
	
	debug('updatePost reqData : ', rawData)
	if(loginUser.isNotEqualById(userId)) return jsonRes.sendFail(userId + ' is not loginUser')
	
	blogBoardService.updatePostAndCategoryId(post, originCategoryId)
	.then(function(status) {
		if(status.isError && status.isError()) return jsonRes.sendFail(status) 
		else return jsonRes.send(status.message)						
	})
	.catch(jsonRes.catch())
}

////post와 관련된것도 다삭제해.
blogBoardController.deleteBlogBoardData = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var loginUser   = authReq.getLoginUser(req)
	var rawData 	= authReq.getRawData(req)
	  , writerId 	= rawData.writerId
	  , postNum 	= rawData.postNum
    
	if(loginUser.isNotEqualById(writerId)) return jsonRes.sendFail(writerId + ' is not writer')  
		
	blogBoardService.deletePost(postNum)
					.then(function(status) {
						if(status.isError && status.isError()) return jsonRes.sendFail(status) 
						else return jsonRes.send(status.message)
					})
					.catch(jsonRes.catch())
}
blogBoardController.increaseVote = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	var rawData 	= authReq.getRawData(req)
	var loginUser   = authReq.getLoginUser(req)
	  , userId		= loginUser._id
	  , postNum     = rawData.postNum
	
	if(loginUser.isAnnoymous()) return jsonRes.sendFail('not login')
	
	debug('increaseVote rawData', rawData)
	blogBoardService.increaseVote( postNum, userId)
					.then(function(status) {
						debug('increaseVote send status', status)
						if(status.isError && status.isError()) return jsonRes.sendFail(status) 
						else return jsonRes.send(status.message)
					})
					.catch(jsonRes.catch())
}
blogBoardController.sendHistory = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	
	blogBoardService.findGroupedPostsByDate()
					.then(function(history) {
						return jsonRes.send(history)
					})
					.catch(jsonRes.catch())
}
////////////////////////////////////////////////////////////////////
/////////////		이아래는..후.정리해야함.
/////////////////////////////////////////////////////////////////
//blogBoardController.sendInsertView = function(req,res) {
//	var redirector = new Redirector(res)
//	var loginUser = requestParser.getLoginUser(req)
//	  , rawData = requestParser.getRawData(req)
//	
//	if(loginUser.isAnnoymous()) return redirector.main();
//	
//	H.call4promise(categoryService.getRootOfCategoryTree)
//	 .then(function (rootOfCategoryTree) {
//		 	var blog = { loginUser: loginUser
//		 			   , rootOfCategoryTree : rootOfCategoryTree
//		 			   , scriptletUtil : scriptletUtil
//		 			   };
//		 	
//			return res.render('./centerFrame/blogBoard/post/insert.ejs', { blog : blog} );
//	 })
//	 .catch(redirector.catch)
//}
//blogBoardController.sendUpdateView = function(req,res) {
//	var redirector = new Redirector(res)
//	var loginUser = requestParser.getLoginUser(req)
//	  , rawData = requestParser.getRawData(req)
//	  , postNum = rawData.postNum
//	
//	if(loginUser.isAnnoymous()) return redirector.main(); //TODO:writer 일치 체크해야함
//	
//	H.all4promise([ [categoryService.getRootOfCategoryTree]
//	              , [postDAO.findByNum, postNum]
//	              ])
//	.then(function (args) {
//		var rootOfCategoryTree = args[0]
//		  , post = args[1]
//		
//		var blog = { loginUser: loginUser
//				   , post : post
//				   , rootOfCategoryTree : rootOfCategoryTree
//				   , scriptletUtil : scriptletUtil
//		};
//		
//		return res.render('./centerFrame/blogBoard/post/update.ejs', { blog : blog} );
//	})
//	.catch(redirector.catch)
//}
//
//blogBoardController.insertBlogBoardData = function(req,res) {
//	var redirector = new Redirector(res)
//	var loginUser = requestParser.getLoginUser(req)
//	  , rawData = requestParser.getRawData(req)
//	  , userId = rawData.userId
//	  , fileInfoesString = rawData.fileInfoesString
//	  , fileInfoes = (fileInfoesString == '') ? [] : JSON.parse(fileInfoesString)
//			  
//	var post = Post.createBy(rawData)
//	post.addFileInfoes(fileInfoes);
//
//	debug('insertPost reqData : ', rawData)
//	if(loginUser.isNotEqualById(userId)) return redirector.main()
//	
//	blogBoardService.insertPostAndIncreaseCategoryCount(new Done(dataFn, redirector.catch), post);
//	function dataFn(insertedPost) {
////		var postNum = insertedPost.num;
////		redirector.post(postNum)
////		debug('insertedPost : ', insertedPost)
//		return redirector.main()
//	}
//}
//blogBoardController.updateBlogBoardData = function(req,res) {
//	var redirector = new Redirector(res)
//	var loginUser = requestParser.getLoginUser(req)
//	, rawData = requestParser.getRawData(req)
//	, userId = rawData.userId
//	, fileInfoesString = rawData.fileInfoesString
//	, fileInfoes = (fileInfoesString == '') ? [] : JSON.parse(fileInfoesString)
//	, originCategoryId = rawData.originCategoryId
//			  
//	var post = Post.createBy(rawData)
//	post.addFileInfoes(fileInfoes);
//	
//	debug('updatePost reqData : ', rawData)
//	if(loginUser.isNotEqualById(userId)) return redirector.main()
//	
//	blogBoardService.updatePostAndCategoryId(new Done(dataFn, redirector.catch), post, originCategoryId);
//	function dataFn(insertedPost) {
////		var postNum = insertedPost.num;
////		redirector.post(postNum)
//		debug('updatePost : ', insertedPost)
//		redirector.main()
//	}
//}
////post와 관련된것도 다삭제해.
//blogBoardController.deletePost = function (req, res) {
//	var redirector = new Redirector(res)
//	var loginUser = requestParser.getLoginUser(req)
//	  , rawData = requestParser.getRawData(req)
//	  , writerId = rawData.writerId
//	  , postNum = rawData.postNum
//      
//	if(loginUser.isNotEqualById(writerId)) return res.send(Status.makeError(writerId + ' can not delete this post'))
//		
//	blogBoardService.deletePost(new Done(dataFn, redirector.catch), postNum);
//	function dataFn(status) {
//		debug('delete post status : ',status)
//		//TODO:에러 상태라면. 지운데이터 되돌리기라는 등의 처리를 해야할까?
//		return res.send(status.getMessage())
//	 }
//}
//blogBoardController.increaseVote = function (req, res) {
//	var redirector = new Redirector(res)
//	var rawData = requestParser.getRawData(req)
//	  , postNum = rawData.postNum
//	  , loginUser = requestParser.getLoginUser(req)
//	  , loginUserId = loginUser._id;
//	
//	if(loginUser.isAnnoymous() ) return res.send('must login');
//	
//	H.call4promise(blogBoardService.increaseVote, postNum, loginUserId)
//	 .then(function (status) {
//		 return res.send(status.toJsonString())
//	 })
//	 .catch(redirector.catch)
//}

//blogBoardController.sendHistoryView = function (req, res) {
//	_sendHistoryView(req, res, './wholeFrame/blogBoard/history.ejs')
//}
//function _sendHistoryView(req, res, viewPath) {
//		var redirector = new Redirector(res)		
//		var loginUser = requestParser.getLoginUser(req);
//		
//		H.all4promise([
//		                 [blogBoardService.findGroupedPostsByDate]
//		               , [categoryService.getRootOfCategoryTree] 
//        ])
//         .then(function dataFn(args) {
// 			var groupedPostsByDate = args[0]
//			  , rootOfCategoryTree = args[1]
//			
//			var blog = { loginUser : loginUser
//					   , groupedPostsByDate : groupedPostsByDate
//	  				   , rootOfCategoryTree : rootOfCategoryTree
//					   , _ : _
//					   , H : H
//					   , scriptletUtil : scriptletUtil 
//					   }
//			res.render(viewPath, {blog : blog});
// 			return;
//		})
//		 .catch(redirector.catch)
//}
