/**
 *   블로그에 해당하는 view의 모든 데이터 통제.
 */



$$namespace.include(function (require, module) {
	var H = require('helper')
	  , Pager= this.require('/domain/Pager') 
	  , Tab= this.require('/domain/Tab')
	  , Category= this.require('/domain/Category')
	
	var blogMap = {
					pager : new Pager({})
				  , tab : new Tab({})
	              , category : new Category({})
				  }
	var blogRepository = module.exports = {}
	
	blogRepository.replacePagerToInit = function () {
		blogMap.pager = new Pager({});
	}
	blogRepository.savePager = function(pager) {
		blogMap.pager = pager;
	}
	blogRepository.saveTab = function (tab) {
		blogMap.tab = tab;
	}
	blogRepository.saveCategory = function (category) {
		blogMap.category = category;
	}
	blogRepository.getBlogMap = function () {
		return blogMap;
	}
})