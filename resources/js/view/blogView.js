/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')
	var views = [ require('/view/pagerView')
	            , require('/view/tabView')
	            ]
	
	var blog =  { id : '#blogListFrame'
			   }
	var blogView = module.exports = {}
	
	blogView.init = function () {
		
	}
	blogView.setActive = function () {
		
	}

	blogView.replaceListDiv = function (html) {
		viewUtil.replaceDiv($(blog.id) , html)
	};
	blogView.active = function (blogMap) {
		for(var i in views) {
			var view = views[i]
			view.active(blogMap)
		}
	}
});