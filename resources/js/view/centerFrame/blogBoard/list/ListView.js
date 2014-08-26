/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')
	
	var LIST_VIEW = '#blogBoard-listView'
	
	var CategoryView = require('/view/common/CategoryView')
	var PagerView = require('/view/blogBoard/list/PagerView')
	  , TabView = require('/view/blogBoard/list/TabView')

	var ListView = module.exports = function ListView() {
		this.pagerView = new PagerView();
		this.tabView = new TabView();
		this.categoryView = new CategoryView()
	}
	
	//get
	ListView.prototype.getCategoryView = function () { return this.categoryView }
	ListView.prototype.getPagerView = function () { return this.pagerView; }
	ListView.prototype.getTabView = function () { return this.tabView; }
	
	ListView.prototype.getHtml = function () {
		return $(LIST_VIEW).html()
	}
	ListView.prototype.replaceHtml = function (html) {
		viewUtil.replaceDiv($(LIST_VIEW) , html)
	}
	//
	ListView.prototype.assignEffect = function (blogMap) {
		var pagerView = this.pagerView
		 ,  tabView = this.tabView
		 ,  categoryView = this.categoryView
		 
		var pager = blogMap.pager
		  , tab = blogMap.tab
		  , category = blogMap.category
		
		pagerView.assignEffect(pager.index);
		tabView.assignEffect(tab.index);
		categoryView.assignEffect(category.id);
	}
});

//@ sourceURL=view/centerFrame/blogBoard/list/ListView.js