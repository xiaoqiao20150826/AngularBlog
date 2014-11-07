/**
 * 
 */



$$namespace.include(function(require, module) {
	
	var H = require('/util/helper')
	  , divUtil= require('view/util/divUtil')
	  , ajax = require('/util/ajax')
	  
	var Action = this.require('/history/Action')
	  , actionHistory = this.require('/history/actionHistory.js')  
	  
	var blogRepository = require('repository/blogRepository')
	  , blogBoardService = this.require('/service/blogBoardService')
	  
	var NavController = module.exports = function(app) {
		var viewManager = app.getViewManager()
		  , navView = viewManager.getNavView()
		  
     	this.app = app
		this.navView = navView
	}
	
	NavController.prototype.onHandler = function () {
		var app = this.app 
		
		var navView = this.navView
		  , $btns = navView.get$btns()
		  , $searchForm = navView.get$searchForm()
		  
		app.onClick($btns, this.clickBtn1(navView) )
		app.onSubmit($searchForm, this.searchBlog1($searchForm) )
	}
	NavController.prototype.clickBtn1 = function (navView) {
		var reStarter = this.app.getReStarter()
		
		return  function clickBtn(e) {
			var $navBtn = $(this)
			  , url = navView.getUrl($navBtn)
			  , action = new Action([this, clickBtn], e)
			
			actionHistory.save(action, url);

			blogRepository.init();    		//요청 전..blog 사용 이력을 초기화 한다.
			if(navView.isNotDropDown($navBtn)) {
				ajax.call(function (html) {
					divUtil.replaceCenterFrame(html);
					reStarter.listOfBlogBoard()
				}, url);
			} 
			navView.assignEffect($navBtn) // 클릭된 버튼으로 직접 효과를 부여하기에 상태저장안해도됨.
			return e.preventDefault(); //버블링방지
		} 
	}
	NavController.prototype.searchBlog1 = function ($searchForm) {
		var reStarter = this.app.getReStarter()
		
		return function searchBlog(e) {
			var formMap = H.formDataToMap($searchForm)
			  , action = new Action([this, searchBlog], e)
//			if(H.notExist(formMap.searcher)) return H.errorWarning(e,'search key is empty')
			
			blogBoardService.saveSearcher(formMap.searcher);//순서주의
			actionHistory.save(action);
			
			blogBoardService.getListHtml(function (html) {
				divUtil.replaceCenterFrame(html)
				reStarter.listOfBlogBoard()
				$searchForm.find('input').val('')
			})
			
			return e.preventDefault(); //기본동작 막기.
		}
	}
})

//@ sourceURL=/controller/NavController.js