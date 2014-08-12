/**
 * 
 */

$$namespace.include(function() {
	var $ = window.$
	
	var H = this.exports = {};
	
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
	H.queryStringToMap = function(queryString) {
		return JSON.parse('{"' + queryString.replace(/&/g, "\",\"").replace(/=/g,"\":\"") + '"}') 
	}
	H.redirect = function (url) {
		return window.location.href = url; 
	}
	H.isErrMessage = function (responseData) {
		if(_.isString(responseData) && responseData.match('err')) return true;
		else return false;
	}
	
	
})
//@ sourceURL=util/helper.js