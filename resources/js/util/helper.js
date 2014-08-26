/**
 * 
 */

$$namespace.include(function() {
	var $ = window.$
	
	var CLASS_ACTIVE = 'active';

	
	var H = this.exports = {};
	
	H.ajaxCall = function ajaxCall(dataFn, type, url, data) {
		$.ajax({
			type: type,
			url: url,
			data: data
		})
		 .done(dataFn)
		 .fail(function(o, errStatus, error) {
			 var errMessage = '['+errStatus+"]["+url+"] : "+ error.stack; 
			 console.error(errMessage);
		 });
	}
	H.exist = function (o) {
		if(_.isFunction(o)) return true;
		if(_.isNumber(o)) return true;
		else {
			if(!_.isEmpty(o)) return true;
			else return false;
		}
	}
	H.notExist = function (o) {
		return !H.exist(o)
	}
	H.queryStringToMap = function(queryString) {
		return JSON.parse('{"' + queryString.replace(/&/g, "\",\"").replace(/=/g,"\":\"") + '"}') 
	}
	H.redirect = function (url) {
		return window.location.href = url; 
	}
//	H.isErrMessage = function (responseData) {
//		if(_.isString(responseData) && responseData.match('err')) return true;
//		else return false;
//	}
	
	
})
//@ sourceURL=util/helper.js