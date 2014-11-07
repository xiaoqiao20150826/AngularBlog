/** 
 *  
 * 
 */


$$namespace.include(function (require, module) {
	var H = require('util/helper')
	var Action = require('history/Action')
	var blogRepository = require('repository/blogRepository')
	
	//TODO: 히스토리가 쌓일수록 속도는 느려질것같은데..
	var browserHistory = window.history
	  , location = window.location
	  , firstUrl = location.href
	  , actions = {}
	  , blogMaps = {}
	  , actionCount = 0
	
	var actionHistory = module.exports = {}
	
	actionHistory.init = function (firstAction) {
		$(window).on('popstate', this.backOrFowardCallback)
		actions = {}
		actionCount = 0;
		
		this.firstAction = firstAction
	}
//	actionHistory.getFirstAction = function () {
//		var action = new Action(function() {
//			location.href = firstUrl;
//		})
//		return action;
//	}
	//title은 거의 사용안함.
	actionHistory.save = function (action, url, title) {
		if(this.isCallByBackOrFowardCallback()) return ;
		
		var key = 'action'+ (++actionCount)
		  , url = url || '/blog'
				  
		actions[key] = action;
		blogMaps[key] = _.clone(blogRepository.getBlogMap())
		
		return browserHistory.pushState(key, title, url)
	}
	actionHistory.isCallingBackOrFowardCallback = false;
	actionHistory.backOrFowardCallback = function ($e) {
		actionHistory.isCallingBackOrFowardCallback = true;
		var e = $e.originalEvent
		  , key = e.state
		  , action = actions[key]
		  , blogMap = blogMaps[key]
		if(H.notExist(action)) {action = actionHistory.firstAction }
		
		if(blogMap) { blogRepository.replaceBlogMap(blogMap); }
		action.run();
		
		actionHistory.isCallingBackOrFowardCallback = false;
		return ;
	}
	actionHistory.isCallByBackOrFowardCallback = function () {
		if(this.isCallingBackOrFowardCallback) return true;
		else return false;
	}
})


//@ sourceURL=actionHistory/actionHistory.js