/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')
	
	var pager = { class : '.blogPager'
				}
	
	var pagerView = module.exports = {}
	
	pagerView.init = function (app) {
		this.activeOne(0);
	}
	pagerView.getDataMap = function($pagerBtn) {
		var ds = $pagerBtn.data()
		  , index = ds.pagenum - 1
		  , pageNum = ds.pagenum
		  , pagerData = {pageNum:pageNum, index: index}
		  
		return pagerData
	}
	pagerView.get$buttons = function() {
		return $(pager.class)
	}
	
	pagerView.active = function (blogMap) {
		var pager = blogMap.pager
		console.log(pager.index)
		this.activeOne(pager.index);
	}
	pagerView.activeOne = function (pagerIndex) {
		viewUtil.activeOne(this.get$buttons(), pagerIndex);
	}
});

//@ sourceURL=/view/pagerView.js