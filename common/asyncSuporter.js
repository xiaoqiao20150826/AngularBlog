/**
 *  비동기 관련 보조 함수들.
 */

/** 
 * reference variables 
 */
var _ = require('underscore')
  , Q = require('q')
  , async = require('async');

var util = require('./util/util.js');

asyncSuporter = module.exports = {};

// 비동기 함수 호출을 위해 doneOrErrFn 파라미터를 만들어준다.
asyncSuporter.doneOrErrFn = function(done, errFn) {
	if(!(util.exist(done))) { throw new Error('done must exist').stack;} 
	
	var result = {};
	result.done = done;
	result.errFn = errFn || null; //없으면 비동기함수 내부에서 에러처리 하기위해 디폴트값주지 않는다.
//	result.errFn = errFn || asyncSuporter.defaultCatch;
	return result;
}

/** 
 * public functions 
 */
// 1) done은 확실히 함수 외부이지만,
// 2) errFn은 외부, 내부 전달로 나뉜다.
asyncSuporter.getCallbackTemplate = function (doneOrErrFn, errFn) {
	if(!(util.exist(doneOrErrFn))) { throw new Error('doneOrErrFn must exist').stack;}
	
	//             템플릿 함수 정의시 이름 주의.
	//done이 이미 template라면 그냥 반환하고
	//아니라면 nomalTemplate 함수를 콜백으로 사용한다.
	if(_isFnAndRightName(doneOrErrFn, 'emplate')) return doneOrErrFn;
	
	var _done, _errFn;
	if(!(_.isFunction(doneOrErrFn))) { //object이면
		_done = doneOrErrFn.done;
		_errFn = doneOrErrFn.errFn;
	} else { 							//function이면.
		_done = doneOrErrFn;
		_errFn = errFn || asyncSuporter.defaultCatch;
	}
	return _nomalTemplate3(_errFn ,_done ,null);
	
	function _isFnAndRightName(fn, name) {
		if(fn instanceof Function) {
    		if(fn.name.indexOf(name) != -1) 
    			return true;
    		else
    			return false;
		}
	}
}

/* promise 사용위한 랩퍼 */
// then, catch로 외부에서 콜백함수를(doneFn, errFn) 을 받는다.
// asyncFn(callback , args.... ) 이런 형태의 함수에 사용.
asyncSuporter.call4promise = function (contextAndAsyncFn /*...args*/) {
	var context, asyncFn;
	if(_.isArray(contextAndAsyncFn)) {
		asyncFn = contextAndAsyncFn.pop();
		context = contextAndAsyncFn.pop();
	} else {
		context = null;
		asyncFn = contextAndAsyncFn;
	}
	
	var deferred = Q.defer();
	var callback = [_promiseTemplate1(deferred)];
	
	var args = _.union(callback, _.toArray(_.rest(arguments)) );
	asyncFn.apply(context, args);
	
	return deferred.promise;
	
}
/* 비동기 함수 호출을 위한 루프 */
//1) someList의 각 원소를 인자로하여 비동기함수를 수행한다
//2) 모든 호출 후  done을 수행한다. 각 비동기함수에서 수행된 datas가 인자로 전달된다. 
//3) 수행될 비동기 함수는 asyncFn(done, ...args) 시그니쳐를 가진다.(context 바인딩가능)
//4) endDone(err, datas){}...
//  ** __eachDone이 data만을 가지는 이유는 asyncFn이 done만을 받기 때문이다.(즉, err처리는 비동기 함수 내부에서 수행된다).
asyncSuporter.asyncLoop = function (someList ,contextAndAsyncFn, endDone, eachErrFn) {
	var context, asyncFn;
	if(_.isArray(contextAndAsyncFn)) {
		asyncFn = contextAndAsyncFn.pop();
		context = contextAndAsyncFn.pop();
	} else {
		context = null;
		asyncFn = contextAndAsyncFn;
	}
	
	async.series(_.map(someList, _iterator), endDone);
	function _iterator(eachVal) {
		return function(saveDataAndNextDo) {
			
			asyncFn.call( context
					    , _asyncLoopTemplate2(eachErrFn, saveDataAndNextDo)
					    , eachVal );
			
		};
	}
}
/* catch */
asyncSuporter.defaultCatch = function (err) {
	throw new Error('Err(default)').stack;
}

/** 
 * private functions 
 */
//비동기 함수의 콜백형식을 간편히 하기 위해 구조와 호출될 함수를 정해놓는다.
//data가 0일 경우 if(0)을 회피하기위해 exist필요.
function _nomalTemplate3(errFn, done, next) {
	return function __nomalTemplate(err, data) {
		
		if(util.exist(err)) return errFn(err);
		
		if(util.exist(data) && done) {return done(data);}
		else console.trace('done이 없다. 올바른가?');   //아마 remove, connect, update 등에서 done을 전달안하고 사용했을거야. 아니면 wrapper사용안한것.일듯
		
		if(next) return next();
	};
};
function _promiseTemplate1(deferred) {
	return function __promiseTemplate(err, data) {
		if(err) deferred.reject(err);
		if(util.exist(data)) deferred.resolve(data);
		//err,data둘다 없으면...무슨상황인걸까.
	};
}

// eachDone 은 asyncLoop에 있다.
function _asyncLoopTemplate2(errFn, saveDataAndNextDo) {
	//promise 사용되는 함수를 위해 아래 프로퍼티가 필요하다.
	_asyncLoopTemplate.done = _done;
	_asyncLoopTemplate.errFn = errFn || null; 
	
	return _asyncLoopTemplate;
	function _asyncLoopTemplate(err,data) {
		if(err) errFn(err)
		//err, data 저장 후 다음 비동기 함수 수행.
		else saveDataAndNextDo(err,data); 
	};
	function _done(data) {
		saveDataAndNextDo(null,data); //여기서 err는 프로마이즈 함수 내부에서 errFn이 처리함.
	}
};