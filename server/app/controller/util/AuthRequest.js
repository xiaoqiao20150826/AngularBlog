/**
 *
 * - 여러가지가 혼합되어있다.
 *   1) req 파라미터, 쿼리, 바디 등을 json 형태로.
 *   2) 세션 컨트롤(현재는 유저만)
 */

var U = require('../../common/util/util.js')
  , _ = require('underscore')
  , User = require('../../domain/User.js')


var AuthRequest = module.exports = function AuthRequest(req) {
	this.req = req;
};

// 이름이 마음에 안들어 ..
// body, query, param 를 얕은 병합해서 반환.(함수 제외)
AuthRequest.prototype.getRawData = function () {
	var query = this.req.query || {}
	  , body = this.req.body || {}
      , params = this.req.params || {};
	
	return U.lightMerge([query, body ,params] , function (value) {
		if(!(_.isFunction(value))) return true;
		else return false;
	});
};

// oaut-passport에서 세션의 이 위치에 로긴한 유저를 저장한 것을 알고있다. req.session.passport.user
AuthRequest.prototype.getLoginUser = function () {
	var loginUser = User.createBy(this.req.session.passport.user);
	if(loginUser.isExist()) return loginUser;
	else return User.getAnnoymousUser();
}

AuthRequest.prototype.setLoginUser = function (user) {
	if(_.isEmpty(user) || user.isAnnoymous() ) return console.error('can not set login user by ', user)
	this.req.session.passport.user = user
}