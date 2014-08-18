/**
 * 
 */

$$namespace.include(function (require, module) {
	var views = [ require('view/blogView')
	            , require('view/pagerView')
	            , require('view/tabView')
	            , require('view/answerView')
	            ];

	var viewManager = module.exports =  {
			init : function (app) {
				for(var i in views) {
					var controller = views[i]
					  , initFn = controller.init
					if(initFn) {
						initFn.call(controller, app)
					}
				};
			}
	};
})
//@ sourceURL=view/viewManager.js