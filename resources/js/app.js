/**
 * 
 */

$$namespace.include(function (require, module) {
	var actionHistory = require('history/actionHistory.js')
	  , Action = require('history/Action')
	  , eventBinder = require('util/eventBinder')
      , blogRepository = require('/repository/blogRepository')	  
	  
    var ControllerManager = require('/controller/ControllerManager')	
	  , ViewManager = require('/view/ViewManager')
	  , ReStarter = require('./ReStarter')
	  
	/////////////////////////
	
	var App = function () {
		//순서주의
		this.viewManager = new ViewManager(this); 
		this.controllerManager = new ControllerManager(this);
		this.reStarter = new ReStarter(this.viewManager, this.controllerManager)
	}
	App.prototype.init = function() {
		blogRepository.init()
		actionHistory.init(_makeFirstAction(this.reStarter))
		
		this.reStarter.main()
	}
	function _makeFirstAction(reStarter) {
		var blogBoardService = require('/service/blogBoardService')
		  , divUtil = require('/view/util/divUtil')
		  
		return new Action(blogBoardService.getFirstListHtml, dataFn)
		function dataFn(html) {
			divUtil.replaceCenterFrame(html)
			reStarter.main()
		}
	} 
	App.prototype.onClick = function ($button, method) { return eventBinder.onClick($button, method); }
	App.prototype.onChange = function ($button, method) { return eventBinder.onChange($button, method); }
	App.prototype.onSubmit = function ($form, method) { return eventBinder.onSubmit($form, method); }
	
	//get 
	App.prototype.getViewManager = function() {return this.viewManager}
	App.prototype.getControllerManager = function() {return this.controllerManager}
	App.prototype.getReStarter = function() {return this.reStarter}
	
///////// 실행자	
	var app = module.exports = {} 
	app.run = function () {
		var application = new App();
		application.init();
		return ;
	}
	
})

//@ sourceURL=app.js