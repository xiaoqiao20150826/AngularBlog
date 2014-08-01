/**
 *    validate, loginCheck 등
 */
// deprease
var reqParser = require('./reqParser.js');

var checker = module.exports = {};

checker.existLoginUser = function (req) {
	var loginUser = reqParser.getLoginUser(req);
	if(loginUser.isExist())
		return true;
	else 
		return false;
}
checker.notExistLoginUser = function (req) {
	return !(this.existLoginUser(req));
}


//(세션에 저장된) 로그인한 유저가 요청에 대한 권한이 있는가.
//userId로 확인하네.
checker.isAuthorizedAbout = function (req) {
	if(this.isLogin(req)) {
		var loginUser = reqParser.getLoginUser(req)
		, curUserId = loginUser._id;
		var rawData = reqParser.getRawData(req)
		, expectedUserId = rawData.userId;
		
		if(curUserId == expectedUserId) return true;
	} 
	return false;
}
checker.isAuthorizedAbout = function (req) {
	if(this.isLogin(req)) {
		var loginUser = reqParser.getLoginUser(req)
		  , curUserId = loginUser._id;
		var rawData = reqParser.getRawData(req)
		  , expectedUserId = rawData.userId;
		
		if(curUserId == expectedUserId) return true;
	} 
	return false;
}
checker.isNotAuthorizedAbout = function (req) {
	return !this.isAuthorizedAbout(req)
}
