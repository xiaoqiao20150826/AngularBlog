/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/util/viewUtil')
	
	var PAGER_BTNS = '.blogPager'
	
	var PagerView = module.exports = function PagerView() {
	}
	
	PagerView.prototype.getDataMap = function($pagerBtn) {
		var ds = $pagerBtn.data()
		  , index = ds.pagenum - 1
		  , pageNum = ds.pagenum
		  , pagerData = {pageNum:pageNum, index: index}
		  
		return pagerData
	}
	PagerView.prototype.get$btns4find = function() {return $(PAGER_BTNS) }
	
	PagerView.prototype.assignEffect = function (pagerIndex) {
		var all$btns = this.get$btns4find()
		  , $btn = viewUtil.find$btn(all$btns, pagerIndex, 'index')
		  
		viewUtil.assignActiveTo$btn($btn, all$btns)
	}
});

//@ sourceURL=/view/PagerView.js