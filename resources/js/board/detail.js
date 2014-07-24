	

(function($, H) {
	//모두 뷰를 위한것.
	var DELETE_BTN_ID = '#post_delete'
	
	var deleteBtn = {
			init : function () {
				$(DELETE_BTN_ID).click(this.deleteAndRedirect);
			},
			deleteAndRedirect : function (e) {
				var dataset = this.dataset;
				H.ajaxCall("delete","/blog/delete?postNum="+dataset.postnum
											 + "&filepath="+dataset.filepath
						 , function(html) {
					console.log(dataset.postnum);
					return;
				});
			}
			
	};
	/// 실행
//	deleteBtn.init();
	//helper
})($, __H);

