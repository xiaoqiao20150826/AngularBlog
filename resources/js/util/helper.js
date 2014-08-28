/**
 * 
 */

$$namespace.include(function() {
	var $ = window.$
	
	
	var H = this.exports = {};
    
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