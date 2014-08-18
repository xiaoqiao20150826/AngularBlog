/**
 * 
 */


$$namespace.include(function (require, module ) {
	var H = require('/util/helper')
	
	var blogRepository = require('/repository/blogRepository')
	
	///
	var blogService = module.exports = {}
	
	blogService.savePager = function (pager) {
		blogRepository.savePager(pager);
	}
	blogService.saveTab = function (tab) {
		blogRepository.saveTab(tab);
	}
	blogService.saveCategory = function (category) {
		blogRepository.saveCategory(category);
	}
	blogService.ajaxBlogListHtml = function (done, e) {
		var blogMap = blogRepository.getBlogMap()
		  , tab = blogMap.tab
		  , pager = blogMap.pager
		  , category = blogMap.category
		  , requestData  = {}
		
		requestData.sorter = tab.sorter
		requestData.pageNum = pager.pageNum
		requestData.categoryId = category.id
		H.ajaxCall(dataFn, "post","/ajax/blogListView", requestData);
		return e.preventDefault(); //버블링방지
		function dataFn(html) {
			return done(html)
		}
	}
	blogService.getBlogMap = function () {
		return blogRepository.getBlogMap();
	}
})

//@ sourceURL=/service/blogService.js