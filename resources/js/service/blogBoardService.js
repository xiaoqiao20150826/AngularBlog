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
	blogBoardService.initPager = function () {
		blogRepository.initPager();
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