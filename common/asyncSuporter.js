/**
 *  비동기 관련 보조 함수들.
 */

/** 
 * reference variables 
 */
var _ = require('underscore')
  , Q = require('q')
  , async = require('async');

var U = require('./util/util.js')
  , Done = require('./Done.js');

asyncSuporter = module.exports = {};
//Done 참조쉽게 여기에 놓음
asyncSuporter.Done = Done;
/////////////
/* 비동기 함수 호출을 위한 루프 */
//1) someList의 각 원소를 인자로하여 비동기함수를 수행한다
//2) 모든 호출 후  done을 수행한다. 각 비동기함수에서 수행된 datas가 인자로 전달된다. 
//3) 수행될 비동기 함수는 asyncFn(done, ...args) 시그니쳐를 가진다.(context 바인딩가능)
//4) endDone(err, datas){}...
//** __eachDone이 data만을 가지는 이유는 asyncFn이 done만을 받기 때문이다.(즉, err처리는 비동기 함수 내부에서 수행된다).
asyncSuporter.asyncLoop = function (someList ,contextAndAsyncFn, done) {
	var eachErrFn = done.getErrFn();
	var context, asyncFn;
	if(_.isArray(contextAndAsyncFn)) {
		asyncFn = contextAndAsyncFn.pop();
		context = contextAndAsyncFn.pop();
	} else {
		context = null;
		asyncFn = contextAndAsyncFn;
	}
	
	
	async.series(_.map(someList, _iterator), done.getCallback());
	function _iterator(eachVal) {
		return function(saveDataAndNextDo) {
			var done = new Done(saveDataAndNextDo, eachErrFn, Done.ASYNC);
			asyncFn.apply(context, _.union(done, eachVal)); 
		};
	}
}

/* promise 사용위한 랩퍼 */
//then, catch로 외부에서 콜백함수를(doneFn, errFn) 을 받는다.
//asyncFn(callback , args.... ) 이런 형태의 함수에 사용.
asyncSuporter.call4promise = function (contextAndAsyncFn /*...args*/) {
	var args = _.toArray(_.rest(arguments));
	var context, asyncFn;
	if(_.isArray(contextAndAsyncFn)) {
		asyncFn = contextAndAsyncFn.pop();
		context = contextAndAsyncFn.pop();
	} else {
		context = null;
		asyncFn = contextAndAsyncFn;
	}
	
	var deferred = Q.defer()
	  , done = new Done(_dataFn, _errFn);
	
	asyncFn.apply(context, _.union(done, args));
	return deferred.promise;
	
	function _errFn(err){ deferred.reject(err)};
	function _dataFn(data){ deferred.resolve(data)};
}

