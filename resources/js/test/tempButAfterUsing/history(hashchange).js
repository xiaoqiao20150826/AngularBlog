/** 
 *  코드가 드럽다.... 상태변화에 의존하는데 상태가 좀...
 *  hashchange이용한것.
 */


$$namespace.include(function (require, module) {
	var H = require('util/helper')
	
	var location = window.location
	
	var prevActionMap = {}
	  , _count = 0
	  , _isCallByPrevAction = false
	
	var history = module.exports = {}
	
	history.init = function () {
		$(window).on("hashchange", this.actionPrev)
	}
	history.save = function (action, context ,args) {
		if(_isCallByPrevAction) return ;
		
		var newHash = '#'+ (++_count)
		location.hash = newHash;
		
		prevActionMap[newHash] = {action : action, context:context, args : args};
		return ;
	}
	history.actionPrev = function (e) {
		var hash = location.hash
		if(H.notExist(hash)) return ;
		if(history.isSaving(hash)) return ;
		
		var prevAction = prevActionMap[hash]
		  , action = prevAction.action
		  , context = prevAction.context
		  , args = prevAction.args
		  
		if(H.notExist(action)) return ;
		
		_isCallByPrevAction = true;
		action.apply(context, args);
		_isCallByPrevAction = false;
		return ;
	}
	history.isSaving = function (hash) {
		if(hash == '#'+_count) return true;
		else return false;
	}
})


//@ sourceURL=util/history.js