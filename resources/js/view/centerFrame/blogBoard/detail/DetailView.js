/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')

	
	var VOTE_BTN = '#blogDetail-vote'
	  , UPDATE_BTN = '#blogBoard-update'
	  , DELETE_BTN = '#blogBoard-delete'
		  
	var DetailView = module.exports = function() {}
	
	DetailView.prototype.get$voteBtn = function () { return $(VOTE_BTN)	}
	DetailView.prototype.get$updateBtn = function () { return $(UPDATE_BTN)	}
	DetailView.prototype.get$deleteBtn = function () { return $(DELETE_BTN)	}
	
	
	DetailView.prototype.assignEffect = function (blogMap) {}
});