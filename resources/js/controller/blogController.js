
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 

	var blogView = this.require('/view/blogView') 
	  , pagerView = this.require('/view/pagerView') 
	  , tabView = this.require('/view/tabView') 
	  , categoryView = this.require('/view/categoryView') 
	  , Pager= this.require('/domain/Pager') 
	  , Tab= this.require('/domain/Tab') 
	  , Category = this.require('/domain/Category') 
	  , blogRepository = this.require('/repository/blogRepository') 
	  , blogService = this.require('/service/blogService') 
		
	//
	var blogController = module.exports = {}
	
	blogController.onHandler = function (app) {
		app.onClick(pagerView.get$buttons(), this.pagerClick)
		app.onClick(tabView.get$buttons(), this.tabClick)
		app.onClick(categoryView.get$buttons(), this.categoryClick)
	}
	
	
	blogController.pagerClick = function (e, app) {
		var $pagerBtn = $(this)
		  , dataMap = pagerView.getDataMap($pagerBtn)
		  , pager = new Pager(dataMap)
		
		blogService.savePager(pager);  
		blogService.ajaxBlogListHtml(dataFn, e)
		function dataFn(html) {
			blogView.replaceListDiv(html);
			app.reRun();
			
			var prevBlogMap = blogService.getBlogMap();
			blogView.active(prevBlogMap);
		}
	}
	blogController.tabClick = function (e, app) {
		if(tabView.isTabButton($(this)) )  {
			var $tabBtn = $(this)
			  , dataMap = tabView.getDataMap($tabBtn)
			  , tab = new Tab(dataMap)
			
			blogService.saveTab(tab);
			blogService.ajaxBlogListHtml(dataFn, e)
		}
		function dataFn(html) {
			blogView.replaceListDiv(html);
			app.reRun();					//사실 탭은 replace대상이 아니므로 안해도되지만. 일관성있게..
			
			var prevBlogMap = blogService.getBlogMap();
			blogView.active(prevBlogMap);
		}
	}
	blogController.categoryClick = function (e, app) {
			var $categoryBtn = $(this)
			, dataMap = categoryView.getDataMap($categoryBtn)
			, category = new Category(dataMap)
			blogService.saveCategory(category);
			blogService.replacePagerToInit()
			blogService.ajaxBlogListHtml(dataFn, e)
		function dataFn(html) {
			blogView.replaceListDiv(html);
			app.reRun();
			
			var prevBlogMap = blogService.getBlogMap();
			blogView.active(prevBlogMap);
		}
	}
	
});

//@ sourceURL=/controller/blogController.js