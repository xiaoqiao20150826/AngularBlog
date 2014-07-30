	

(function($, H) {
	var ns = $$NameSpace("com.kang.board");
	
	
	var BLOG_PAGER= '.blogPager'
	  , CLASS_ACTIVE = 'active';
	var pager = ns.pager = {
			init : function (selectedPageNum) {
				$(BLOG_PAGER).click(this.replaceBlogListHtml);
				
				selectedPageNum = selectedPageNum || 1;
				var $pagerBtn = pager.findByPageNum(selectedPageNum);
				pager.changeActivePager($pagerBtn);
			},
			replaceBlogListHtml : function (e) {
				if(!(H.isNodeName(this,'LI'))) return;
				
				var $pagerBtn = $(this);
				var ds = $pagerBtn.data()
				  , data = {pageNum:ds.pagenum, sorter:ds.sorter}
				  , selectedPageNum = ds.pagenum;
				
				H.ajaxCall(dataFn, "post","/ajax/blogListView", data);
				function dataFn(html) {
					H.get$BlogListFrame()
					 .replaceWith(html)
					
					pager.init(selectedPageNum);
				}
			},
			findByPageNum : function (selectedPageNum) {
				return $(BLOG_PAGER).filter(function () {
					var $btn = $(this)
					  , ds = $btn.data()
					  , pageNum = ds.pagenum
					  , text = $btn.text();
					//TODO: << >> 이거면 선택안되게 해놨음. text > 0 글자면 false나오는 것으로 구분
					if(text > 0 && pageNum == selectedPageNum)
						return true;
					else
						return false;
                });
			},
			changeActivePager : function ($pagerBtn) {
				var $siblingTapBtns = $pagerBtn.siblings();
				
				$pagerBtn.addClass(CLASS_ACTIVE);
				$siblingTapBtns.removeClass(CLASS_ACTIVE);
			}
	};
	/// 실행
	pager.init();
})($, __H);

//var SELECTED = 'selected';
//selectedOne : function ($btn) {
//	var className = 'selected';
//	pager.addClassToOneOfSiblings($btn, className);
//},
//get$selctedBtn : function (btnClassName) {
//	if(!(btnClassName.charAt(0) == '.')) btnClassName = '.'+btnClassName;
//	var className4selector = btnClassName+'.selected';
//	return $(className4selector);
//},
//addClassToOneOfSiblings : function ($btn, className) {
//	$btn.addClass(className);
//	var $siblingTapBtns = $btn.siblings();
//	$siblingTapBtns.removeClass(className);
//},