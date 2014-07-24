(function($, H) {
	
	var BOARD_BTN_ID = '#board'
		  , _$boardBtn = null;
		var boardBtn = {
				init : function () {
					_$boardBtn = $(BOARD_BTN_ID);
					_$boardBtn.click(this.getHtml);
					
				},
				getHtml : function () {
					$.ajax({
						  type: "get",
						  url: "/board"
//						  data: { name: "John", location: "Boston" }
					})
					 .done(function( html ) {
						 H.get$CenterFrame().replaceWith(html);
				    });
				}
		}
	
//	boardBtn.init();
	$('[data-toggle="tooltip"]').tooltip();
})($, __H)
