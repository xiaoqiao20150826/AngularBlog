	

(function($, H) {
	var INSERT_ANSWER_DIV = '#insert-answer-div'
	  , EMBEDDED_ANSWER_DIV = '.embedded-answer-div'
	  , EMBEDDED_ANSWER_BTN = '.embedded-answer';
	
	var $insertAnswerHtml;
	var answerBtn = {
			init : function () {
				$insertAnswerHtml = $(INSERT_ANSWER_DIV).html();
				$(EMBEDDED_ANSWER_BTN).click(this.toggleEmbeddedAnswerDiv);
			},
			toggleEmbeddedAnswerDiv : function (e) {
				
				var $target = $(this).siblings().last()
				  , answerNum = $target.data().answernum;
				
				if(H.isEmptyChildren($target)) {
					$target.html('');
				} else {
					$target.html($insertAnswerHtml);
					var $AnswerNumInput = $target.find('.answerNum');
					$AnswerNumInput.attr('value', answerNum);
				}
			}
	};
	/// 실행
	answerBtn.init();
})($, __H);

