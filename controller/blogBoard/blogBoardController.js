
/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:route:blog')
var _ = require('underscore')
  , Q = require('q')
var H = require('../../common/helper.js')
 , Done = H.Done

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

var blogController = module.exports = {
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
	mapUrlToResponse : function(app) {
//		app.get('/', this.listLayoutView);
//		app.get('/blog', this.listLayoutView);
//		app.post('/blog', this.insertPost);
		
//		
//		app.get('/blog/new', this.insertView);
//		app.get('/blog/delete', this.deletePostOrFile);
		app.get('/blog/history', this.sendHistoryView);
//		
//		app.get('/blog/:postNum(\\d+)', this.detailView);
//		app.get('/blog/:postNum(\\d+)/:title', this.detailView);
//		
		// ajax
		app.post('/ajax/blogBoardList', this.sendBlogBoardList)
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
 	, sendBlogBoardList : function (req, res) {
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
//	insertView : function(req,res) {
//		var redirector = new Redirector(res)
//		var loginUser = requestParser.getLoginUser(req)
//		  , rawData = requestParser.getRawData(req)
//		
//		if(loginUser.isNotExist()) return redirector.main();
//		
//		H.call4promise(categoryService.getRootOfCategoryTree)
//		 .then(function (rootOfCategoryTree) {
//			 	var blog = { loginUser: loginUser
//			 			   , rootOfCategoryTree : rootOfCategoryTree
//			 			   , scriptletUtil : scriptletUtil
//			 			   };
//			 	
//				return res.render('./blog/insert.ejs', { blog : blog} );
//		 })
//	},
//	detailView : function(req, res) {
//		var redirector = new Redirector(res)
//		var rawData = requestParser.getRawData(req)
//		  , postNum = rawData.postNum
//		  , loginUser = requestParser.getLoginUser(req)
//		  , cookie = new Cookie(req, res);
//		
//		var errFn = redirector.catch;
//		H.all4promise([
//		               	  [blogService.increaseReadCount, postNum, cookie]
//		               	, [blogService.getJoinedPost, postNum]
//		])
//		 .then(function dataFn(args) {
//			 var joinedPost = args[1]
//  			 if(joinedPost.isEmpty()) return redirector.main() 
//			
//			 var blog = { loginUser : loginUser
//					    , post : joinedPost
//			 			}
//			 
//			 res.render('./blog/detailLayout.ejs',{blog : blog} )
//		 })
//		 .catch(errFn);
//	},
//	insertPost : function(req,res) {
//		var redirector = new Redirector(res)
//		var loginUser = requestParser.getLoginUser(req)
//		  , rawData = requestParser.getRawData(req)
//		  , userId = rawData.userId
//		var post = Post.createBy(rawData)
//		  , file = _.first(_.toArray(req.files));//TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감
//
//		debug('insertPost reqData : ', rawData)
//		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return redirector.main()
//		
//		blogService.insertPostWithFile(new Done(dataFn, redirector.catch), post, file);
//		function dataFn(insertedPost) {
////			var postNum = insertedPost.num;
////			redirector.post(postNum)
//			redirector.main()
//		}
//	},
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
	, sendHistoryView : function (req, res) {
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
			res.render('./wholeFrame/blogBoard/history.ejs',{blog : blog});
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