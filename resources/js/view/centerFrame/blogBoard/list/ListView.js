/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/util/viewUtil')
      , divUtil = require('/view/util/divUtil')
	
	var LIST_VIEW = '#blogBoard-listView'
		
	//includeView	
	var PagerView = require('/view/blogBoard/list/PagerView')
	  , TabView = require('/view/blogBoard/list/TabView')

	var INSERT_VIEW_BTN = '#blogBoard-insertView'
		
	var DETAIL_VIEW_BTNS = '.blogBoard-detailView'
	  , ROW_NODES =  '.blogBoard-row'
		  
	var ListView = module.exports = function ListView(categoryView) {
		this.pagerView = new PagerView();
		this.tabView = new TabView();
		this.categoryView = categoryView
	}
	
	//get
	ListView.prototype.getCategoryView = function () { return this.categoryView }
	ListView.prototype.getPagerView = function () { return this.pagerView; }
	ListView.prototype.getTabView = function () { return this.tabView; }
	
	ListView.prototype.get$insertViewBtn = function () { return $(INSERT_VIEW_BTN); }
	ListView.prototype.get$detailViewBtn = function () { return $(DETAIL_VIEW_BTNS); }
	ListView.prototype.get$rowNode = function () { return $(ROW_NODES); }
	
	ListView.prototype.assignEffectSelectedPost = function (num) {
		var all$btns = this.get$rowNode()
		  , $btn = viewUtil.find$btn(all$btns, num, 'num')
		  
		viewUtil.assignBgColorTo$btn($btn, all$btns, 'bg-success')
	}
	//
	ListView.prototype.assignEffect = function (blogMap) {
		var pagerView = this.pagerView
		 ,  tabView = this.tabView
		 ,  categoryView = this.categoryView
		 
		var pager = blogMap.pager
		  , tab = blogMap.tab
		  , category = blogMap.category
		  , post = blogMap.post
		
		pagerView.assignEffect(pager.index);
		tabView.assignEffect(tab.index);
		categoryView.assignEffect(category.id);
		this.assignEffectSelectedPost(post.num)
	}
});

//@ sourceURL=view/centerFrame/blogBoard/list/ListView.js