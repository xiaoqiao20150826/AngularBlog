/**
 * 
 */

$$namespace.include(function (require, module) {
	var actionHistory = require('history/actionHistory.js')
	  , eventBinder = require('util/eventBinder')
	  
    var blogRepository = require('repository/blogRepository')  
	  
    var ControllerManager = require('/controller/ControllerManager')	
	  , ViewManager = require('/view/ViewManager')
	  
	/////////////////////////
	
	var App = function () {
		//순서주의
		
		this.viewManager = new ViewManager(this); 
		this.controllerManager = new ControllerManager(this);
		
		this.init();
	}
	App.prototype.init = function() {
//		TODO: firstAction으로 history초기화하는것.보류..이상해진다.
		actionHistory.init()
	}
	App.prototype.onClick = function ($button, method) { return eventBinder.onClick($button, method); }
	App.prototype.onSubmit = function ($form, method) { return eventBinder.onSubmit($form, method); }
	
	// 핸들러 바인딩, 뷰에 효과주기.
//	App.prototype.onHandlerAndAssignEffect = function () {
//		
//		var blogMap = blogRepository.getBlogMap()
//		this.viewManager.assignEffect(blogMap);
////		this.controllerManager.
//	}
	
	//get 
	App.prototype.getViewManager = function() {return this.viewManager}
	
///////// 실행자	
	var app = module.exports = {} 
	app.run = function () {
		return new App();
	}
	
})

//@ sourceURL=app.js