$(document).ready(function() {
	_initialize();    
});
/////////////
function _initialize() {
	$('[data-toggle="tooltip"]').tooltip();
	
	boardBtn.init();
	insertBtn.init();
	
}

var BOARD_BTN_ID = '#board'
  , _$boardBtn = null;

var boardBtn = {
		init : function () {
			_$boardBtn = $(BOARD_BTN_ID);
			_$boardBtn.click(this.getHtml);
		},
		getHtml : function () {
			console.log(arguments);
			$.ajax({
				  type: "get",
				  url: "/detail"
//				  data: { name: "John", location: "Boston" }
			})
			 .done(function( html ) {
				 _get$CenterFrame().replaceWith(html);
		    });
		}
}
var INSERT_BTN_ID = '#insert'
	, _$insertBtn = null;

var insertBtn = {
		init : function () {
			_$insertBtn = $(INSERT_BTN_ID);
			_$insertBtn.click(this.getHtml);
		},
		getHtml : function () {
			console.log(arguments);
			$.ajax({
				type: "get",
				url: "/insert"
//				  data: { name: "John", location: "Boston" }
			})
			.done(function( html ) {
				if(html.match(/div/) == null) 
					return alert(html);
				else
					return _get$CenterFrame().replaceWith(html);
			});
		}
}
var CENTER_FRAME_ID = '#center_frame'
function _get$CenterFrame() {
	return $(CENTER_FRAME_ID);
} 
