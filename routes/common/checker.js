/**
 *    validate, loginCheck 등
 */

var reqParser = require('./reqParser.js');

var checker = module.exports = {};

checker.isLogin = function (req) {
	var loginUser = reqParser.getLoginUser(req);
	
	if(loginUser)
		return true;
	else 
		return false;
}
checker.isNotLogin = function (req) {
	return !(this.isLogin(req));
}

checker.isNotLogin = function (req) {
	return !(this.isLogin(req));
}


//(세션에 저장된) 로그인한 유저가 요청에 대한 권한이 있는가.
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
