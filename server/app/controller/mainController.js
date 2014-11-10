
/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:controller:main')
var _ = require('underscore')
  , Q = require('q')
var H = require('../common/helper.js')
 , Done = H.Done

var requestParser = require('./util/requestParser.js')
  , Cookie = require('./util/Cookie.js')
  , Redirector = require('./util/Redirector.js')
  , scriptletUtil = require('../common/util/scriptletUtil.js')
  
var User = require('../domain/User.js')
var Post = require('../domain/blogBoard/Post.js')
  , Category = require('../domain/blogBoard/Category')
  , blogBoardService = require('../service/blogBoard/blogBoardService')
  , categoryService = require('../service/blogBoard/categoryService')

var FIRST_PAGE_NUM = 1
  , SORTER_NEWEST = 'newest'

var mainController = module.exports = {}
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
mainController.mapUrlToResponse = function(app) {
		//TODO: 순서 주의. 두번째 arg가 string을 먼저 구분한뒤 숫자형을 받아야함..
		app.get('/', this.sendBlogBoardListView);
		app.get('/blog', this.sendBlogBoardListView);
		//navigation
		
		//test
		app.get('/cookie', _seeCookie);
		app.get('/test', _test);
}
/* 요청에 대한 서비스를 제공하고 응답한다. */
	//게시판 정보, 로그인 체크 및 유저정보 제공.
mainController.sendBlogBoardListView  = function (req, res) {
	var redirector = new Redirector(res)
	var rawData = requestParser.getRawData(req)
	  , pageNum = _.isEmpty(rawData.pageNum) ? FIRST_PAGE_NUM : rawData.pageNum  
	  , sorter = _.isEmpty(rawData.sorter) ? SORTER_NEWEST: rawData.sorter
	  , categoryId = Category.isRoot(rawData.categoryId) ? Category.getRootId() : rawData.categoryId
	  , loginUser = requestParser.getLoginUser(req)
	
//	console.log('pageNum',pageNum, _.isNumber(pageNum))
	debug('/ rawData ',rawData)  
	var errFn = redirector.catch;
	H.call4promise(blogBoardService.getFullList, pageNum, sorter, categoryId)
     .then(function dataFn(blogBoard) {
       	var posts = blogBoard.posts
       	  , pager = blogBoard.pager.make4view(pageNum)
       	  , allCategories = blogBoard.allCategories
	      , rootOfCategoryTree = categoryService.categoriesToTree(allCategories, 'postCount', 0)

		var blog = {posts : posts
				  , pager : pager
				  , rootOfCategoryTree : rootOfCategoryTree
				  , loginUser : loginUser 
				  , scriptletUtil : scriptletUtil
				  };
//       	debug('/ blog ',blog)
		return res.render('./index.ejs', {blog : blog});
	})
     .catch(errFn)
}
/*    helper   */

//test
function _test(req, res) {
	req.session.passport.user = User.getTester()
	res.redirect('/');
}
function _seeCookie(req, res) {
    res.send(req.headers);
}