/**
 *  비동기 관련 보조 함수들.
 */

var debug = require('debug')('nodeblog:common:asyncSuporter')
var _ = require('underscore')
  , Q = require('q')
  , async = require('async');

var U = require('./util/util.js')
  , Done = require('./Done.js');

asyncSuporter = module.exports = {};
//Done 참조쉽게 여기에 놓음
asyncSuporter.Done = Done;

//            deprease
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
	
//	asyncFn.apply(context, _.union(done, args)); //union시 중복값이 사라짐. pager는 같은값이전달되기도하는데..
	asyncFn.apply(context, [done].concat(args));
	return deferred.promise;
	
	function _errFn(err){ deferred.reject(err)};
	function _dataFn(data){ deferred.resolve(data)};
}


asyncSuporter.all4promise = function (asyncMethodAndArgsList) {
	if(!_.isArray(asyncMethodAndArgsList)) throw new Error('arguments must be array');
	debug('$all4promise : ',asyncMethodAndArgsList)
	return this.call4promise(this.all, asyncMethodAndArgsList)
}
// all
// # 전제
//     1) this가 필요할시 알아서 바인딩할것. 그런데 바인딩하면되는지확인안함.
//     2) asyncMethod(done , arg1, .....)  첫번째 파라미터가 done인 함수  
// # 이상한것
//  TODO: 하나의 함수일때 arg를 전달하기 위해서는 [ [fn, arg1..] ] 이렇게 해야해.이상해.
//  TODO: promise가 인자로 오는 기능은 아직임. 확인하고 then에 연결해야함.
asyncSuporter.all = function (done, asyncMethodAndArgsList) {
	if(!_.isArray(asyncMethodAndArgsList)) asyncMethodAndArgsList = [asyncMethodAndArgsList]
	var lastDataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  , lastCallIndex = asyncMethodAndArgsList.length
	var orderAndReturnArgs = {}
	  , callCount = 0;
	
	_.each(asyncMethodAndArgsList, function (asyncMethodAndArgs, i) {
		if(!_.isArray(asyncMethodAndArgs)) asyncMethodAndArgs = [asyncMethodAndArgs]
		
		
		var eachDataFn = indexedEachDataFn(i)
		  , eachDone = new Done(eachDataFn, errFn)
		var asyncMethod = _.first(asyncMethodAndArgs)
		  , args = _.union(eachDone, _.rest(asyncMethodAndArgs))
		if(!_.isFunction(asyncMethod)) throw console.error(''+ asyncMethod+ ' must be function')
		debug(i+ ':'+'args of asyncMethod :' +args)
		asyncMethod.apply(null, args)
	})
	
	function indexedEachDataFn(index) {

		return function eachDataFn(/* args */) {
			debug(index+ ':'+'args asyncCall :' +arguments)
			var args = null;
			switch(arguments.length) {
				case 0 : break;
				case 1 : 
					args = _.first(arguments);
					break;
				default : //큰경우
					args = _.toArray(arguments);
					break;
			}
			orderAndReturnArgs[index] = args;
			
			debug('lastCallIndex and called count ' +lastCallIndex+ ' and '+callCount+'+1')
			if(lastCallIndex == (++callCount)) {
				lastDataFn(orderAndReturnArgs)
			}
		}
	}
}