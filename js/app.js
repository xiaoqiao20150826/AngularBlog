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
	//시작 주소가 여럿일수있으므로 이렇게.(즐겨찾기되었거나하면..) 
	function _makeFirstAction(reStarter) {
		var firstHref = window.location.href;
		return new Action(reLocation)
		function reLocation() {
			window.location.href = firstHref
		}
	}
	App.prototype.onClick = function ($button, method) { return eventBinder.onClick($button, method); }
	App.prototype.onChange = function ($button, method) { return eventBinder.onChange($button, method); }
	App.prototype.onSubmit = function ($form, method) { return eventBinder.onSubmit($form, method); }
	
	//get 
	App.prototype.getViewManager = function() {return this.viewManager}
	App.prototype.getControllerManager = function() {return this.controllerManager}
	App.prototype.getReStarter = function() {return this.reStarter}
	
	App.prototype.setImageUploadCallback = function (method) {
		this.imageUploadCallback = method
	}
	App.prototype.getImageUploadCallback = function() {
		return this.imageUploadCallback
	}
	
///////// 실행자	
	var app = module.exports = {} 
	app.run = function () {
		var application = new App();
		application.init();
		return application;
	}
})

//@ sourceURL=app.js