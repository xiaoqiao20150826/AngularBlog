	

$$namespace.include(function() {
	var H = this.require('/util/helper') 
	  , pager = this.require('/blog/pager');
	  

	var BLOG_TAP= '.blogTap'
	  , CLASS_ACTIVE = 'active';
		
	var tabs = this.exports = {
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
					
					pager.init();
				}
			}
	};
	/// 실행
	tabs.init();
});


//@ sourceURL=blog/tabs.js