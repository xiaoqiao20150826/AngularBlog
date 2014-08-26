
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 
	
	var Pager= this.require('/domain/blogBoard/Pager') 
	  , Tab= this.require('/domain/blogBoard/Tab') 
	  , Category = this.require('/domain/blogBoard/Category')
	  
	var Action = this.require('/history/Action')
	  , actionHistory = this.require('/history/actionHistory.js')
	  
	var blogBoardService = this.require('/service/blogBoardService') 
		
	//
	var ListController = module.exports = function (app) {
		var viewManager = app.getViewManager()
		  , listView = viewManager.getListView()
		  
		this.app = app;
		this.listView = listView
		
		this.init();
	}
	ListController.prototype.init = function () {
		this.onHandler(); 
	}
	ListController.prototype.onHandler = function () {
		var app = this.app 
		
		var listView = this.listView
		  , pagerView = listView.getPagerView()
		  , tabView = listView.getTabView()
		  , categoryView = listView.getCategoryView()
		  
		var $pagerBtns4find = pagerView.get$btns4find()
		  , $tabBtns4find = tabView.get$btns4find()
		  , $categoryBtns4find = categoryView.get$btns4find()
 
		// layout
		app.onClick($pagerBtns4find, this.clickPagerBtns4find1(pagerView) )
		app.onClick($tabBtns4find, this.clickTabBtns4find1(tabView) )
		app.onClick($categoryBtns4find, this.clickCategoryBtns4find1(categoryView) )
		// blogDetail
//		app.onClick(blogDetailView.get$voteButton(), this.increaseVote)
		
	}
	
	ListController.prototype.clickPagerBtns4find1 = function (pagerView) {
		var self = this;
		
		return function clickPagerBtns4find(e) {
			var $pagerBtn = $(this)
			  , dataMap = pagerView.getDataMap($pagerBtn)
			  , pager = new Pager(dataMap)
			  , action = new Action([this, clickPagerBtns4find], e);
			
			actionHistory.save(action);
			blogBoardService.savePager(pager);
			
			var callback = self.callback1(self)
			blogBoardService.ajaxBlogListHtml(callback, e)
		}
	}
	ListController.prototype.clickTabBtns4find1 = function (tabView) {
		var self = this;
		
		return function clickTabBtns4find(e) {
			var $tabBtn = $(this)
			, dataMap = tabView.getDataMap($tabBtn)
			, tab = new Tab(dataMap)
			, action = new Action([this, clickTabBtns4find], e);
			
			actionHistory.save(action);
			blogBoardService.saveTab(tab);
			blogBoardService.initPager()
			
			var callback = self.callback1(self)
			blogBoardService.ajaxBlogListHtml(callback, e)
		}
	}
	ListController.prototype.clickCategoryBtns4find1 = function (categoryView) {
		var self = this;
		
		return function clickCategoryBtns4find(e) {
			var $categoryBtn = $(this)
			, dataMap = categoryView.getDataMap($categoryBtn)
			, category = new Category(dataMap)
			, action = new Action([this, clickCategoryBtns4find], e);
			
			actionHistory.save(action);
			blogBoardService.saveCategory(category);
			blogBoardService.initPager()
			
			var callback = self.callback1(self)
			blogBoardService.ajaxBlogListHtml(callback, e)
		}
	}
	
	//
	
	//뷰의 html을 변경하고, 그 영역의 핸들러 바인딩, 효과 재 할당.
	// 이름이름!
	ListController.prototype.callback1 = function (self) {
		
		return function (html) {
			var listView = self.listView
			  , blogMap = blogBoardService.getBlogMap();
			
			listView.replaceHtml(html);
			listView.assignEffect(blogMap);
			
			self.onHandler();
		}
	}
//	listController.increaseVote = function (e, app) {
//		var ds = this.dataset
//		  , data = {userId:ds.userid, postNum:ds.postnum}
//		
//		H.ajaxCall(dataFn, "post","/ajax/increaseVote", data)
//		return e.preventDefault();
//		
//		function dataFn(message) {
//			blogDetailView.increaseOrNone(message)
//			var $voteButton = blogDetailView.get$voteButton()
//			$voteButton.unbind('click')
//			app.onClick($voteButton, function() {
//				blogDetailView.alreadyVote()
//			});
//		}
//	}
	
});

//@ sourceURL=/controller/blogBoard/ListController.js