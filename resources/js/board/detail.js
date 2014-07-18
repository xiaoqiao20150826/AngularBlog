	

(function($, H) {
	//모두 뷰를 위한것.
	var DELETE_BTN_ID = '#post_delete'
	var deleteBtn = {
			init : function () {
				$(DELETE_BTN_ID).click(this.deleteAndRedirect);
			},
			deleteAndRedirect : function (e) {
				var dataset = this.dataset;
				H.ajaxCall("get","/board/delete?postNum="+dataset.postnum, function(html) {
					console.log(dataset.postnum);
					return H.get$CenterFrame().replaceWith(html);
				});
			}
			
	};
	/// 실행
	deleteBtn.init();
	//helper
})($, __H);

