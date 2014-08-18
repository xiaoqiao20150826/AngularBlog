/**
 *  tabView는 ajax에서 새로가져오지 않아 유지됨.	
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')
	
	var tab = { class : '.blogTap'
			  }
	
	var tabView = module.exports = {}
	
	tabView.init = function (app) {
		this.activeOne(0);
	}
	tabView.getDataMap = function($tabBtn) {
		var ds = $tabBtn.data()
		  , sorter = $tabBtn.text()
		  , data = {sorter: sorter, index:ds.index}
		  
		return data;
	}
	tabView.isNotTabButton = function ($btn) {
		return !this.isTabButton($btn)
	}
	tabView.isTabButton = function ($btn) {
		var classNames = $btn.attr('class')
		if(classNames.indexOf('blogTap') != -1) return true;
		else return false;
	};
	tabView.get$buttons = function() {
		return $(tab.class)
	}
	tabView.active = function (blogMap) {
		var tab = blogMap.tab
		this.activeOne(tab.index);
	}
	tabView.activeOne = function (tabIndex) {
		viewUtil.activeOne(this.get$buttons(), tabIndex);
	}
});
//@ sourceURL=/view/tabView.js