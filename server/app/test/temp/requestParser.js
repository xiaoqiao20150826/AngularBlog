/**
 * 더이상사용안함
 *  - 여러가지가 혼합되어있다.
 *   1) req 파라미터, 쿼리, 바디 등을 json 형태로.
 *   2) 세션에 저장된 유저정보를 이용한 인증.
 *   2-1) 관리자관련 정보.
 *   3) passport.. sns 서비스를 이용할때 파라미터 분석방법.
 */

var U = require('../../common/util/util.js')
  , _ = require('underscore')
  , User = require('../../domain/User.js')


var requestParser = module.exports = {};

// 이름이 마음에 안들어 ..
// body, query, param 를 얕은 병합해서 반환.(함수 제외)
requestParser.getRawData = function (req) {
	var query = req.query || {}
	  , body = req.body || {}
      , params = req.params || {};
	
	return U.lightMerge([query, body ,params] , function (value) {
		if(!(_.isFunction(value))) return true;
		else return false;
	});
};
requestParser.getLoginUser = function (req) {
	var loginUser = User.createBy(req.session.passport.user);
	if(loginUser.isExist()) return loginUser;
	else return User.getAnnoymousUser();
}

