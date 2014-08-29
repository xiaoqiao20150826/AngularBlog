
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 
	  , ajax = this.require('/util/ajax') 
	  , divUtil = require('/view/util/divUtil')
	  
	var Pager= this.require('/domain/blogBoard/Pager') 
	  , Tab= this.require('/domain/blogBoard/Tab') 
	  , Category = this.require('/domain/blogBoard/Category')
	  , Post = this.require('/domain/blogBoard/Post')
	  
	var Action = this.require('/history/Action')
	  , actionHistory = this.require('/history/actionHistory.js')
	  
	var blogBoardService = this.require('/service/blogBoardService') 
		
	//
	var ListController = module.exports = function (app) {
		var viewManager = app.getViewManager()
		  , listView = viewManager.getListView()
		  
		this.app = app;
		this.listView = listView
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
          , $detailViewBtn = listView.get$detailViewBtn()
          , $insertViewBtn = listView.get$insertViewBtn()
          
        var insertController = this.insertController  
		// layout
		app.onClick($pagerBtns4find, this.clickPagerBtns4find1(pagerView) )
		app.onClick($tabBtns4find, this.clickTabBtns4find1(tabView) )
		app.onClick($categoryBtns4find, this.clickCategoryBtns4find1(categoryView) )
		app.onClick($detailViewBtn, this.clickDetailViewBtn1(listView))
		app.onClick($insertViewBtn, this.clickInsertViewBtn1(listView))
		// blogDetail
//		app.onClick(blogDetailView.get$voteButton(), this.increaseVote)
		
	}
		
	ListController.prototype.clickPagerBtns4find1 = function (pagerView) {
		var reStarter = this.app.getReStarter()
		
		return function clickPagerBtns4find(e) {
			var $pagerBtn = $(this)
			  , dataMap = pagerView.getDataMap($pagerBtn)
			  , pager = new Pager(dataMap)
			  , action = new Action([this, clickPagerBtns4find], e);
			
			actionHistory.save(action);
			blogBoardService.savePager(pager);
			
			blogBoardService.getListHtml(function (html) {
				divUtil.replaceCenterFrame(html)
				reStarter.listOfBlogBoard()
			})
			
			return e.preventDefault(); //버블링방지
		}
	}
	ListController.prototype.clickTabBtns4find1 = function (tabView) {
		var reStarter = this.app.getReStarter()
		
		return function clickTabBtns4find(e) {
			var $tabBtn = $(this)
			, dataMap = tabView.getDataMap($tabBtn)
			, tab = new Tab(dataMap)
			, action = new Action([this, clickTabBtns4find], e);
			
			actionHistory.save(action);
			blogBoardService.saveTab(tab);
			blogBoardService.initPager()
			
			blogBoardService.getListHtml(function (html) {
				divUtil.replaceCenterFrame(html)
				reStarter.listOfBlogBoard()
			})
			
			return e.preventDefault(); //버블링방지
		}
	}
	ListController.prototype.clickCategoryBtns4find1 = function (categoryView) {
		var reStarter = this.app.getReStarter()
		
		return function clickCategoryBtns4find(e) {
			var $categoryBtn = $(this)
			, dataMap = categoryView.getDataMap($categoryBtn)
			, category = new Category(dataMap)
			, action = new Action([this, clickCategoryBtns4find], e);
			
			actionHistory.save(action);
			blogBoardService.saveCategory(category);
			blogBoardService.initPager()
			
			blogBoardService.getListHtml(function (html) {
				divUtil.replaceCenterFrame(html)
				reStarter.listOfBlogBoard()
			})
			
			return e.preventDefault(); //버블링방지
		}
	}
	
	//
	ListController.prototype.clickDetailViewBtn1 = function(listView) {
		var reStarter = this.app.getReStarter()
	    
		return function clickDetailViewBtn(e) {
			var $detailViewBtn = $(this)
			  , num = $detailViewBtn.data().num
			  , url = $detailViewBtn.attr('href')
			
			var post = new Post(num)
			  , action = new Action([this, clickDetailViewBtn], e);
			
			actionHistory.save(action, url);
			blogBoardService.savePost(post);
			
			
			ajax.call(callback, url);
			function callback(html) {
				divUtil.replaceCenterFrame(html)
				reStarter.detailOfBlogBoard() // 이건 detail
			}
			
			return e.preventDefault(); //버블링방지
		}
	}
	
	// insertController 로 전환이 일어남. 
ListController.prototype.clickInsertViewBtn1 = function(listView) {
	var reStarter = this.app.getReStarter()
    
	return function clickInsertViewBtn(e) {
		var action = new Action([this, clickInsertViewBtn], e)
		
		actionHistory.save(action)
		ajax.call(callback, '/blogBoard/insertView');
		function callback(html) {
			divUtil.replaceCenterFrame(html)
			reStarter.insertOfBlogBoard() 
		}
		
		return e.preventDefault(); //버블링방지
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