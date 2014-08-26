/**
 * 
 */
//@ sourceURL=contorller/controllerManager.js
$$namespace.include(function (require, module) {

	var ListController = require('controller/blogBoard/ListController.js')
	
	var ControllerManager = module.exports =  function (app) {
		this.app = app
		this.listController = new ListController(app);
		this.controllers = [ this.listController ]
	}

	
	ControllerManager.prototype.init = function (app) {
//		for(var i in controllers) {
//			var controller = controllers[i]
//			  , init = controller.init
//			if(init) {  controller.init(app); }
//		};
	}
	
})
