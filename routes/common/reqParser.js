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

