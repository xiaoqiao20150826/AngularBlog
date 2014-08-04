	

(function() {
	var ns = $$namespace.package('com.kang')
	  , utilPackage = ns.package('util')
	  , answerPackage = ns.package('answer')
	  , H = utilPackage.import('helper') 
	
	var VOTE_BTN = '#post_increase_vote'
	var $voteBtn;
	var voteBtn = answerPackage.export.voteBtn = {
			init : function () {
				$voteBtn = $(VOTE_BTN);
				$voteBtn.click(this.increaseVote);
			},
			increaseVote : function (e) {
				var ds = this.dataset
				  , voteCount = ds.votecount
				var data = {userId:ds.userid, postNum:ds.postnum};
				H.ajaxCall(dataFn, "post","/ajax/increaseVote", data)
				
				function dataFn(success) {
					if(isSuccess(success)) {
						$voteBtn.unbind('click');
						$voteBtn.text('★ Vote '+(++voteCount));
					} else {
						alert(success);
					}
					function isSuccess(str) {
						if(str.indexOf('sucess') != -1) return true;
						else return false;
					}
				}
			}
			
	};
	voteBtn.init();
	//helper
})();

