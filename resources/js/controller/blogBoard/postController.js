
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 

	var blogBoardListView = this.require('/view/blogBoard/listView') 
	  , postDetailView = this.require('/view/blogBoard/post/detailView')
	  
	  , tabView = this.require('/view/blogBoard/tabView') 
	  , pagerView = this.require('/view/blogBoard/pagerView') 
	  , categoryView = this.require('/view/categoryView')
	  
	var Pager= this.require('/domain/Pager') 
	  , Tab= this.require('/domain/Tab') 
	  , Category = this.require('/domain/Category')
	  
	var blogRepository = this.require('/repository/blogRepository')
	
	var blogService = this.require('/service/blogService') 
		
	//
	var blogController = module.exports = {}
	
	blogController.onHandler = function (app) {
		// layout
		app.onClick(pagerView.get$buttons(), this.pagerClick)
		app.onClick(tabView.get$buttons(), this.tabClick)
		
		// siedFrame
		app.onClick(categoryView.get$buttons(), this.categoryClick)
		
		// blogDetail
		app.onClick(blogDetailView.get$voteButton(), this.increaseVote)
		
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
	blogController.increaseVote = function (e, app) {
		var ds = this.dataset
		  , data = {userId:ds.userid, postNum:ds.postnum}
		
		H.ajaxCall(dataFn, "post","/ajax/increaseVote", data)
		return e.preventDefault();
		
		function dataFn(message) {
			blogDetailView.increaseOrNone(message)
			var $voteButton = blogDetailView.get$voteButton()
			$voteButton.unbind('click')
			app.onClick($voteButton, function() {
				blogDetailView.alreadyVote()
			});
		}
	}
	
});

//@ sourceURL=/controller/blogController.js