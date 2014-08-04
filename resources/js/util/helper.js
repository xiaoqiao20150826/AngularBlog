/**
 * 
 */

(function(window) {
	var $ = window.$
	  , utilPackage = $$namespace.package('com.kang').package('util')
	  , log = utilPackage.import('log');
	
	var H = utilPackage.export.helper = {};
	
	// 안쓰는것같던데..?
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
	
})(this)
//@ sourceURL=util/helper.js