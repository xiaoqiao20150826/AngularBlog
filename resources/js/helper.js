/**
 * 
 */



(function($) {
	
	var H = {};
	this.__H = H;
	
	var BLOG_LIST_FRAME = '#blogListFrame';
	H.get$BlogListFrame = function () {
		return $(BLOG_LIST_FRAME);
	};
	
	H.ajaxCall = function ajaxCall(dataFn, type, url, data) {
		$.ajax({
			type: type,
			url: url,
			data: data
		})
		.done(dataFn);
	}
	
	H.isEmptyChildren = function ($parent) {
		if($parent.children().length > 0) 
			return true;
		else
			return false;
	}
	
	H.isNodeName = function (node, name) {
		if(node.nodeName && node.nodeName == name) return true;
		else return false;
	}
})($)


