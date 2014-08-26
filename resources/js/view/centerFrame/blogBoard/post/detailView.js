/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')

	
	var VOTE_BTN = '#blogDetail-increase-vote'
	var blogDetailView = module.exports = {}
	
	blogDetailView.init = function () {
	}
	blogDetailView.get$voteButton = function () {
		return $(VOTE_BTN)
	}
	blogDetailView.increaseOrNone = function (message) {
		var $voteBtn = this.get$voteButton()
          , ds = $voteBtn.data()
		  , voteCount = ds.votecount
		if(isSuccess(message)) { $voteBtn.text('★ Vote '+(++voteCount)); }
		
		alert(message);
		function isSuccess(str) {
			if(str.indexOf('success') != -1) return true;
			else return false;
		}
	}
	blogDetailView.alreadyVote = function () {
		alert('already voted')
	}
});