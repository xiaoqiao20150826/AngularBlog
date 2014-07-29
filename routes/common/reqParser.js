/**
 * 
 */

var U = require('../../common/util/util.js')
  , _ = require('underscore');

var POST_COOKIE = 'post';

var reqParser = module.exports = {};

// 이름이 마음에 안들어 ..
// body, query, param 를 얕은 병합해서 반환.(함수 제외)
reqParser.getRawData = function (req) {
	var query = req.query || {}
	  , body = req.body || {}
      , params = req.params || {};
	
	return U.lightMerge([query, body ,params] , function (value) {
		if(!(_.isFunction(value))) return true;
		else return false;
	});
};
reqParser.getLoginUser = function (req) {
	return req.session.passport.user || null;
}

// passport로 소셜서비스에서 전달된 데이터를 아래 형식의 레코드로 반환해준다.
reqParser.profileToUserInfo = function (profile) {
	var userData = {};
	if(U.exist(profile.provider)) {
		userData._id = profile.id +'-' +  profile.provider;
//		userData.password = profile.password || profile.pw;
		userData.name =  profile.displayName || profile.name;
		userData.photo = profile.photo || profile._json.avatar_url || profile._json.picture || 
					 profile._json.pictureUrl || valueOfFirstOfList(profile.photos);
		if(profile.provider == 'facebook') userData.photo = profile._json.picture.data.url;
		
		userData.email = profile.email || valueOfFirstOfList(profile.emails);
	}
	return userData;
	
	function valueOfFirstOfList(list) {
		if(U.notExist(list)) return null;
		else return _.first(list).value || null; 
	};
}