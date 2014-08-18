
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 

	var answerView = this.require('/view/answerView') 
		
	//
	var answerController = module.exports = {}
	
	answerController.onHandler = function (app) {
		app.onClick(answerView.get$insertViewButtons(), this.insertViewClick)
		app.onClick(answerView.get$voteButton(), this.increaseVote)
	}
	answerController.insertViewClick = function (e, app) {
		var $embeddedAnswerDiv = answerView.get$embeddedAnswerDiv($(this))
		  , answerNum = $embeddedAnswerDiv.data().answernum
		
		answerView.replaceEmbeddedAnswerDiv($embeddedAnswerDiv, answerNum);
		return e.preventDefault();
	}
	answerController.increaseVote = function (e, app) {
		var ds = this.dataset
		  , data = {userId:ds.userid, postNum:ds.postnum}
		
		H.ajaxCall(dataFn, "post","/ajax/increaseVote", data)
		return e.preventDefault();
		
		function dataFn(message) {
			answerView.increaseOrNone(message)
			var $voteButton = answerView.get$voteButton()
			$voteButton.unbind('click')
			app.onClick($voteButton, function() {
				answerView.alreadyVote()
			});
		}
	}
});

//@ sourceURL=/controller/answerController.js