(function() {
	var ns = $$namespace.package('com.kang')
	  , answerPackage = ns.package('answer')
	  , utilPackage = ns.package('util')
	  , H = utilPackage.import('helper');
	
	var INSERT_ANSWER_DIV = '#insert-answer-div'
	  , EMBEDDED_ANSWER_DIV = '.embedded-answer-div'
	  , EMBEDDED_ANSWER_BTN = '.embedded-answer';
	
	var $insertAnswerHtml;
	var insertViewBtn = answerPackage.export.insertViewBtn = {
			init : function () {
				$insertAnswerHtml = $(INSERT_ANSWER_DIV).html();
				$(EMBEDDED_ANSWER_BTN).click(this.replaceEmbeddedAnswerDiv);
			},
			replaceEmbeddedAnswerDiv : function (e) {
//				var $embeddedAnswerDiv = $(this).siblings().last()
				var $embeddedAnswerDiv = $(this).parent().find(EMBEDDED_ANSWER_DIV)
				  , answerNum = $embeddedAnswerDiv.data().answernum;
				
				if(H.isEmptyChildren($embeddedAnswerDiv)) {
					$embeddedAnswerDiv.html('');
				} else {
					$embeddedAnswerDiv.html($insertAnswerHtml);
					var $answerNumInput = $embeddedAnswerDiv.find('.answerNum')
					  , $answerDeepInput = $embeddedAnswerDiv.find('.answerDeep');
					
					$answerNumInput.attr('value', answerNum);
					var deep = $answerDeepInput.attr('value');
					$answerDeepInput.attr('value', ++deep); //현재값 가져와서 1플러스
				}
			}
	};
	/// 실행
	insertViewBtn.init();
})();

//@ sourceURL=answer/insertViewBtn.js