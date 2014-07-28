/**
 * express에서 파싱해준 req, res를 이용하여 쿠키를 제어.
 * 
 * 쿠키값 [{key:value} , {key:value} ,...]
 */

var _ = require('underscore');

var Cookie = module.exports = function (req, res) {
	this.req = req;
	this.res = res;
};

Cookie.prototype.set = function (key, value) {
	var list = this.get(key);
	if(!(_.contains(list,value))) list.push(value);
	
	this.res.cookie(key, list);
	return list;
}
Cookie.prototype.get = function (key) {
	var cookies = this.req.cookies
	  , value = cookies[key];
	
	if(_.isEmpty(value)) return [];
	else return value;
//	else return JSON.parse(value); //
}
Cookie.prototype.isContains = function (key, value) {
	var list = this.get(key);
	if(_.contains(list,value)) return true;
	else return false;
}


//Cookie.prototype.getCookieList = function () {
//	var str = this.req.headers.cookie;
//	if(_.isEmpty(str)) return [];
//	else return JSON.parse(str);
//}
//
////cookie 관련
//Cookie.prototype.beSawPostNum = function (req, postNum) {
//	 var list = _getListInCookie(req, POST_COOKIE);
//	 if(_.indexOf(postNum) != -1) 
//		 return true;
//	 else
//		 return false;
//};
//Cookie.prototype.keepPostNum = function (req, postNum) {
//	_setValueToCookie(req, POST_COOKIE, postNum);
//};
//
//
//function _getListInCookie (req, key) {
//	_initCookieValueIfEmpty(req, key)
//	var cookie = req.headers.cookie;
//	var cookieObject = JSON.parse(cookie);
//	return cookieObject[key];
//}
//function _setValueToCookie (req, key, value) {
//	var headers = req.headers
//	  , list = _getListInCookie (req, key);
//	console.log('l',list)
//	list.push(value);
//	
//	var cookieObject = JSON.parse(headers.cookie);
//	cookieObject[key] = list;
//	headers.cookie = JSON.stringify(cookieObject)
//}
//
//function _initCookieValueIfEmpty(key) {
//	var headers = req.headers
//	  , cookie = headers.cookie;
//	
//	var initObject = {};
//	initObject[key] = [];
//	
//	if(_.isEmpty(cookie)) headers.cookie = JSON.stringify(initObject)
//}
