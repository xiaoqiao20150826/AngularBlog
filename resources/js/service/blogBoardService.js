/**
 * 
 */


$$namespace.include(function (require, module ) {
	var H = require('/util/helper')
	
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
	blogBoardService.initPager = function () {
		blogRepository.initPager();
	}
	blogBoardService.ajaxBlogListHtml = function (done, e) {
		var blogMap = blogRepository.getBlogMap()
		  , tab = blogMap.tab
		  , pager = blogMap.pager
		  , category = blogMap.category
		  , requestData  = {}
		
		requestData.sorter = tab.sorter
		requestData.pageNum = pager.pageNum
		requestData.categoryId = category.id
		H.ajaxCall(dataFn, "post","/ajax/blogBoardList", requestData);
		return e.preventDefault(); //버블링방지
		function dataFn(html) {
			return done(html)
		}
	}
	blogBoardService.getBlogMap = function () {
		return blogRepository.getBlogMap();
	}
})

//@ sourceURL=/service/blogBoardService.js