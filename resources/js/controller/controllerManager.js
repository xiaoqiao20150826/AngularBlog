/**
 * 
 */
//@ sourceURL=contorller/controllerManager.js
$$namespace.include(function (require, module) {
	var controllers = [
	                   	 require('controller/blogController.js')
	                   , require('controller/answerController.js')
	                   , require('controller/adminController.js')
	              	  ];

	var controllerManager = module.exports =  {
			onHandler : function (app) {
				for(var i in controllers) {
					var controller = controllers[i]
					  , onHandler = controller.onHandler
					if(onHandler) {
						onHandler.call(controller, app)
					}
				};
			}
	};
})
