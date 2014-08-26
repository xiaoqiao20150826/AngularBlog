/** 
 *  
 * 
 */


$$namespace.include(function (require, module) {
	var H = require('util/helper')
	var Action = require('history/Action')
	
	var browserHistory = window.history
	  , location = window.location
	  , firstUrl = location.href
	  , actions = {}
	  , actionCount = 0
	
	var actionHistory = module.exports = {}
	
	actionHistory.init = function () {
		$(window).on('popstate', this.backOrFowardCallback)
		actions = {}
		actionCount = 0;
		
	}
	actionHistory.getFirstAction = function () {
		var action = new Action(function() {
			location.href = firstUrl;
		})
		return action;
	}
	//title은 거의 사용안함.
	actionHistory.save = function (action, url, title) {
		if(this.isCallByBackOrFowardCallback()) return ;
		
		var key = 'action'+ (++actionCount)
//		  , url = url || key
				  
		actions[key] = action;
		
		return browserHistory.pushState(key, title, url)
	}
	actionHistory.isCallingBackOrFowardCallback = false;
	actionHistory.backOrFowardCallback = function ($e) {
		actionHistory.isCallingBackOrFowardCallback = true;
		var e = $e.originalEvent
		  , key = e.state
		  , action = actions[key]
		 
		console.log('back key ',key )
		console.log('state ',browserHistory.state)
		if(H.notExist(action)) {action = actionHistory.getFirstAction() } 
		
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