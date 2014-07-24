	

(function($, H) {
	//모두 뷰를 위한것.
//	var LIST_BTN_CLASS = '.boardList'
	  var INSERT_BTN_ID = '#insert'
      , DETAIL_BTN_CLASS = '.detail';
	var boardBtn = {
			init : function () {
//				$(LIST_BTN_CLASS).click(this.getListViewByPageNum);
				$(INSERT_BTN_ID).click(this.getInsertView);
				$(DETAIL_BTN_CLASS).click(this.getDetailView);
			},
//			getListViewByPageNum : function (e) {
//				var pageNum = e.target.text;
//				H.ajaxCall("get","/board?pageNum="+pageNum, function(html) {
//					return H.get$CenterFrame().replaceWith(html);
//				});
//			},
			getInsertView : function () {
				H.ajaxCall("get","/board/new", function(html) {
					if(html.match(/div/) == null) 
						return alert(html);
					else
						return H.get$CenterFrame().replaceWith(html);
				});
			},
			//버블링으로 이벤트 받음.
			getDetailView : function (e) {
				var dataset = this.dataset;
				H.ajaxCall("get","/board/detail?postNum="+dataset.postnum, function(html) {
					console.log(html)
					return H.get$CenterFrame().replaceWith(html);
				});
			}
			
	};
	/// 실행
//	boardBtn.init();
	//helper
})($, __H);

