/**
 *  TabView는 ajax에서 새로가져오지 않아 유지됨.	
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/util/viewUtil')
	
	var TAB_BTNS = '.blogTap'
	var TabView = module.exports = function () {
	}
	
	TabView.prototype.getDataMap = function($tabBtn) {
		var ds = $tabBtn.data()
		  , sorter = $tabBtn.text()
		  , data = {sorter: sorter, index:ds.index}
		  
		return data;
	}
	TabView.prototype.isNotTabButton = function ($btn) {
		return !this.isTabButton($btn)
	}
	TabView.prototype.isTabButton = function ($btn) {
		var classNames = $btn.attr('class')
		if(classNames.indexOf('blogTap') != -1) return true;
		else return false;
	};
	TabView.prototype.get$btns4find = function() {
		return $(TAB_BTNS)
	}
	TabView.prototype.assignEffect = function (tabIndex) {
		var all$btns = this.get$btns4find()
		  , $btn = viewUtil.find$btn(all$btns, tabIndex, 'index')
		  
		viewUtil.assignActiveTo$btn($btn, all$btns)
	}
});
//@ sourceURL=/view/TabView.js