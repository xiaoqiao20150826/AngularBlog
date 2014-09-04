/**
 * util, asyncSuporter ,...  인터페이스 역할을 한다.(퍼사드)
 */

// db callback helper

var asyncSuporter = require('./asyncSuporter.js')
  , U = require('./util/util.js');

var H = module.exports = {};

var count = 0;
// 두 싱글톤 객체의 함수 참조 복사.
(function() {
	U.cloneFnOfObject(U, H);
	U.cloneFnOfObject(asyncSuporter, H);
//	console.log('helper.js는 require될때마다 호출될까? : ',++count);
})();
