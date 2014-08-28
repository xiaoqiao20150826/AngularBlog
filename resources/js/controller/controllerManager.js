/**
 * 
 */
//@ sourceURL=contorller/controllerManager.js
$$namespace.include(function (require, module) {

	var ListController = require('controller/blogBoard/ListController.js')
	  , InsertController = require('controller/blogBoard/InsertController.js')
	  , NavController = require('controller/NavController.js')
	
	var ControllerManager = module.exports =  function (app) {
		this.app = app
		this.listController = new ListController(app);
		this.navController = new NavController(app);
		this.insertController = new InsertController(app);
		
		this.controllers = [ this.listController
		                   , this.navController
		                   , this.insertController
		                   ]
	}

	ControllerManager.prototype.onHandlerAll = function () {
		for(var i in this.controllers) {
			var controller = this.controllers[i]
			if(controller.onHandler) controller.onHandler();
		}
	}
	ControllerManager.prototype.onHandlerAboutCenterFrame = function () {
		this.listController.onHandler()
	}
	//개별
	ControllerManager.prototype.onHandlerAboutListOfBlogBoard = function () {
		this.listController.onHandler()
	}
	ControllerManager.prototype.onHandlerAboutInsertOfBlogBoard = function () {
		this.insertController.onHandler()
	}
	ControllerManager.prototype.getInsertController = function () { return this.insertController }
//	ControllerManager.prototype.onHandler = function (app) {
//		for(var i in controllers) {
//			var controller = controllers[i]
//			  , init = controller.init
//			if(init) {  controller.init(app); }
//		};
//	}
	
})
