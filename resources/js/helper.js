/**
 * 
 */



(function($) {
	
	var H = {};
	this.__H = H;
	
	var CENTER_FRAME_ID = '#center_frame';
	H.get$CenterFrame = function () {
		return $(CENTER_FRAME_ID);
	};
	
	H.ajaxCall = function ajaxCall(type, url, dataFn) {
		$.ajax({
			type: type,
			url: url
		})
		.done(dataFn);
	}
	
	H.isEmptyChildren = function ($parent) {
		if($parent.children().length > 0) 
			return true;
		else
			return false;
	}
})($)


