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
		  
		app.onClick($btns, this.clickBtn1(navView) )
	}
	NavController.prototype.clickBtn1 = function (navView) {
		var reStarter = this.app.getReStarter()
		
		return  function clickBtn(e) {
			var $navBtn = $(this)
			  , url = navView.getUrl($navBtn)
			  , action = new Action([this, clickBtn], e)
			
			actionHistory.save(action, url);
			
			if(navView.isNotDropDown($navBtn)) {
				ajax.call(function (html) {
					divUtil.replaceCenterFrame(html);
					reStarter.listOfBlogBoard()
				}, url);
			} 
			navView.assignEffect($navBtn)
			return e.preventDefault(); //버블링방지
		} 
	}
})

//@ sourceURL=/controller/NavController.js