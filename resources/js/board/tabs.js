	

(function($, H) {
	var ns = $$NameSpace("com.kang.board");

	var BLOG_TAP= '.blogTap'
	  , CLASS_ACTIVE = 'active';
		
	var tabs = ns.tabs = {
			init : function () {
				$(BLOG_TAP).click(this.changeActiveAndReplaceBlogList);
			},
			changeActiveAndReplaceBlogList : function (e) {
				if(!(isTabBtn(this))) return;
				
				var $tabBtn = $(this);
				tabs.getBlogListHtml($tabBtn);
				tabs.changeActiveTap($tabBtn);
				
				function isTabBtn(node) {
					if(node.nodeName && node.nodeName == 'LI') return true;
					else return false;
				}
			},
			changeActiveTap : function ($tabBtn) {
				var $siblingTapBtns = $tabBtn.siblings();
				
				$tabBtn.addClass(CLASS_ACTIVE);
				$siblingTapBtns.removeClass(CLASS_ACTIVE);
			},
			getBlogListHtml : function ($tabBtn) {
				var sorter = $tabBtn.text();
				var data = {sorter : sorter};
				H.ajaxCall(dataFn, "post","/ajax/blogListView", data);
				function dataFn(html) {
					H.get$BlogListFrame()
					 .replaceWith(html)
					
					//TODO: 스크립트 배치까지 제어하면 이럴필요는없을텐데.
					var ns = $$NameSpace("com.kang.board")
					  , pager = ns.pager;
					pager.init();
				}
			}
	};
	/// 실행
	tabs.init();
})($, __H);


