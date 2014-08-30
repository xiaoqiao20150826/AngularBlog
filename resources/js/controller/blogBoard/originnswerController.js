
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 

	var answerView = this.require('/view/centerFrame/blogBoard/answer/answerView') 
		
	//
	var answerController = module.exports = {}
	
	answerController.onHandler = function (app) {
		app.onClick(answerView.get$insertViewButtons(), this.insertViewClick)

	}

	answerController.insertViewClick = function (e, app) {
		var $embeddedAnswerDiv = answerView.get$embeddedAnswerDiv($(this))
		  , answerNum = $embeddedAnswerDiv.data().answernum
		
		answerView.replaceEmbeddedAnswerDiv($embeddedAnswerDiv, answerNum);
		return e.preventDefault();
	}
});

//@ sourceURL=/controller/answerController.js