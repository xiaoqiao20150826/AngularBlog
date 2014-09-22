/**
 * 
 */


$$namespace.include(function (require, module ) {
	var H = require('/util/helper')
	  , ajax = require('/util/ajax')
	
	var blogRepository = require('/repository/blogRepository')
	
	///
	var blogBoardService = module.exports = {}
	
	blogBoardService.savePager = function (pager) {
		blogRepository.savePager(pager);
	}
	blogBoardService.saveTab = function (tab) {
		blogRepository.saveTab(tab);
	}
	blogBoardService.saveCategory = function (category) {
		blogRepository.saveCategory(category);
	}
	blogBoardService.savePost = function (post) {
		blogRepository.savePost(post);
	}
	blogBoardService.saveSearcher = function (searcher) {
		blogRepository.saveSearcher(searcher);
	}
	blogBoardService.initPager = function () {
		blogRepository.initPager();
	}
	//이름요상한
	blogBoardService.getFirstListHtml = function (done) {
		blogRepository.init()
		blogBoardService.getListHtml(done)
	}
	blogBoardService.getListHtml = function (done) {
		var blogMap = blogRepository.getBlogMap()
		  , tab = blogMap.tab
		  , pager = blogMap.pager
		  , category = blogMap.category
		  , requestData  = {}
		
		requestData.sorter = tab.sorter
		requestData.pageNum = pager.pageNum
		requestData.categoryId = category.id
		requestData.searcher = blogMap.searcher
		
		console.log('요청',category)
		ajax.call(dataFn,"/blogBoard/List", requestData);
		function dataFn(html) {
			return done(html)
		}
	}
	blogBoardService.getBlogMap = function () {
		return blogRepository.getBlogMap();
	}
})

//@ sourceURL=/service/blogBoardService.js