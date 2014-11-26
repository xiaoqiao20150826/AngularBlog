/**
 * util, asyncSuporter ,...  인터페이스 역할을 한다.(퍼사드)
 */

// db callback helper

var U = require('./util/util.js');

var H = module.exports = {};

//
H.cb4mongo1 = function cb4mongo1(deferred) {
	return function callbackOfMongoose(err, data) {
		if(U.exist(err)) 
			return deferred.reject(err)
		else
			return deferred.resolve(data)
	}
}

var count = 0;
// 두 싱글톤 객체의 함수 참조 복사.
(function() {
	U.cloneFnOfObject(U, H);
//	console.log('helper.js는 require될때마다 호출될까? : ',++count);
})();
