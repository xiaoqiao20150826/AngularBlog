/**
 *  비동기 관련 보조 함수들.
 */


//  debug 값은 모든 ~4promise의 에러를 확인을 위해 독립적으로 사용한다. 
var debug = require('debug')('error')
var _ = require('underscore')
  , Q = require('q')
  , async = require('async')

var U = require('./util/util.js')
  , Done = require('./Done.js')
  , Status = require('./Status.js') 
  
asyncSuporter = module.exports = {};
//Done 참조쉽게 여기에 놓음
asyncSuporter.Done = Done;

           


/* promise 사용위한 랩퍼 */
//then, catch로 외부에서 콜백함수를(doneFn, errFn) 을 받는다.
	//asyncFn(callback , args.... ) 이런 형태의 함수에 사용.
asyncSuporter.call4promise = function (contextAndAsyncFn /*...args*/) {
	var args = _.toArray(_.rest(arguments));
	var target = getContextAndAsyncMethod(contextAndAsyncFn)
	  , context = target.context
	  , asyncMethod = target.asyncMethod
	
	var deferred = Q.defer()
	  , done = new Done(_dataFn, _errFn);
	
	asyncMethod.apply(context, _.flatten([done,args], true) ); 
	return deferred.promise;
	
	function _errFn(err){
		debug(asyncMethod.name + ' : ' + (err ? err.toString() : err) ); //TODO 에러확인하기 힘들경우, 발생한 모든 에러확인하기 위함.
		return deferred.reject(err)
	};
	function _dataFn(data){ return deferred.resolve(data)};
}

asyncSuporter.syncAll4promise = function (asyncMethodAndArgsList) {
	if(!_.isArray(asyncMethodAndArgsList)) return console.error(asyncMethodAndArgsList + ' : firstArg must be array');
	return asyncSuporter.call4promise(asyncSuporter.syncAll, asyncMethodAndArgsList)
}

// 비동기함수를 동기함수처럼 순차적으로 호출.
// error만날시 바로 endErrFn호출되고 nextDataFn은 호출되지 않으므로 다음작업하지 않음.
asyncSuporter.syncAll = function(endDone, asyncMethodAndArgsList) {
	var endDataFn = endDone.getDataFn()
	  , endErrFn = endDone.getErrFn()
	
	var curIndex = 0 
	  , endIndex = asyncMethodAndArgsList.length
	  , returnDatas = {}
	
	nextDataFn(null);
	
	function nextDataFn(data) {
		if(curIndex != 0) returnDatas[curIndex-1] = data
		if(curIndex == endIndex) return endDataFn(returnDatas); //stop
	
		var asyncMethodAndArgs = asyncMethodAndArgsList[curIndex++]; //호출후 증가나 다름없다
		return asyncSuporter.callOne(new Done(nextDataFn, endErrFn), asyncMethodAndArgs)
	}
}
asyncSuporter.callOne = function (done, asyncMethodAndArgs) {
	var errFn = done.getErrFn()
	
	if(!_.isArray(asyncMethodAndArgs)) asyncMethodAndArgs = [asyncMethodAndArgs]
	var contextAndAsyncFn = _.first(asyncMethodAndArgs)
	var target = getContextAndAsyncMethod(contextAndAsyncFn)
	  , context = target.context
	  , asyncMethod = target.asyncMethod
	
	var args = _.flatten([done, _.rest(asyncMethodAndArgs)], true)
	asyncMethod.apply(context, args)
}

asyncSuporter.all4promise = function (asyncMethodAndArgsList) {
	if(!_.isArray(asyncMethodAndArgsList)) throw new Error('arguments must be array');
	return asyncSuporter.call4promise(asyncSuporter.all, asyncMethodAndArgsList)
}
// all
// # 전제
//     1) this가 필요할시 알아서 바인딩할것. 그런데 바인딩하면되는지확인안함.
//     2) asyncMethod(done , arg1, .....)  첫번째 파라미터가 done인 함수  
// # 이상한것
//  TODO: 하나의 함수일때 arg를 전달하기 위해서는 [ [fn, arg1..] ] 이렇게 해야해.이상해.
//  TODO: promise가 인자로 오는 기능은 아직임. 확인하고 then에 연결해야함.
asyncSuporter.all = function (lastDone, asyncMethodAndArgsList) {
	if(!_.isArray(asyncMethodAndArgsList)) asyncMethodAndArgsList = [asyncMethodAndArgsList]
	var lastCallIndex = asyncMethodAndArgsList.length
	  , orderedResults = {}
	  , callCount = 0
	  , lastCallback = lastCallback4statuses1(lastDone)
	  
	_.each(asyncMethodAndArgsList, function (asyncMethodAndArgs, i) {
		if(!_.isArray(asyncMethodAndArgs)) asyncMethodAndArgs = [asyncMethodAndArgs]
		
		var eachDataFn = indexedEachDataFn(i)
		var eachErrFn = function (err) { return eachDataFn(Status.makeError(err)) }
		var eachDone = new Done(eachDataFn, eachErrFn)
		
		var contextAndAsyncFn = _.first(asyncMethodAndArgs)
		var target = getContextAndAsyncMethod(contextAndAsyncFn)
		  , context = target.context
		  , asyncMethod = target.asyncMethod
		var args = _.flatten([eachDone, _.rest(asyncMethodAndArgs)], true)
		asyncMethod.apply(context, args)
	})
	
	function indexedEachDataFn(index) {
		//현재 errorStatus와 datas가 args로 전달된다.
		//args 로 인자 수 구분해놓은 이유는 apply로 호출하기 때문. 
		return function eachDataFn(/* args... */) {
			var args = null
			  
			switch(arguments.length) {
				case 0 : break;
				case 1 : 
					args = _.first(arguments);
					break;
				default : //큰경우
					args = _.toArray(arguments);
					break;
			}
			
			var status = null
			
			if(!_.isArray(args) && Status.isStatusType(args) ) {
				status = args; 
			} else {
				status = Status.makeSuccess()
				status.data4all = args;
			}
			orderedResults[index] = status;
			
			if(lastCallIndex == (++callCount)) {
//				console.log('o',orderedResults)
				return lastCallback(null, orderedResults)
			}
		}
	}
}


/////////////
//TODO: 이거 이름이 잘못됨. 동기식루프임.
/* 비동기 함수 호출을 위한 루프 */
//1) someList의 각 원소를 인자로하여 비동기함수를 수행한다
//2) 모든 호출 후  done을 수행한다. 각 비동기함수에서 수행된 datas가 인자로 전달된다. 
//3) 수행될 비동기 함수는 asyncFn(done, eachVal) 시그니쳐를 가진다.(context 바인딩가능)
//4) endDone(err, datas){}...
//** __eachDone이 data만을 가지는 이유는 asyncFn이 done만을 받기 때문이다.(즉, err처리는 비동기 함수 내부에서 수행된다).
//    
asyncSuporter.asyncLoop = function (someList, contextAndAsyncFn, lastDone, isOrder) {
	var target = getContextAndAsyncMethod(contextAndAsyncFn)
	  , context = target.context
	  , asyncMethod = target.asyncMethod
	
	var contextAndAsyncMethod = [context, asyncMethod]
	  
	var argOfAll4promise = _.map(someList, function (v, i) {
		return [contextAndAsyncMethod, v];
	}, [])
	
	var lastDataFn = lastDone.getDataFn()
	  , lastErrFn = lastDone.getErrFn()
	
	var loop4all = (isOrder) ? asyncSuporter.syncAll4promise : asyncSuporter.all4promise
	return loop4all(argOfAll4promise)
					.then(function (args) {
						lastDataFn(args)
					})
					.catch(lastErrFn)
}




// deprecated 사용안할듯.
// * 주의 : 첫번째 arg는 done이라는 가정하에 나머지 args만 바인딩한다
asyncSuporter.bindRest = function (contextAndAsyncFn /* ...rest args */) {
	var context, method;
	
	var target = getContextAndAsyncMethod(contextAndAsyncFn)
	  , context = target.context
	  , asyncMethod = target.asyncMethod
	
	var argsOfRest = _.rest(arguments);
	
	// 첫번째는 done으로 정해짐.
	// arg와 다른 arg가 있다면... 애매해지네.
	return function bindedMethod(done /* ...args*/) {
		if(!Done.isDoneInstance(done)) return console.error(done + ' : done must need done for async call')
		var allArgs = _.flatten([done, argsOfRest], true)
		return asyncMethod.apply(context, allArgs);
	} 
}

//    helper
function lastCallback4statuses1(lastDone) {
	var lastDataFn = lastDone.getDataFn()
	  , lastErrFn = lastDone.getErrFn()
	  
	return function lastCallback(err, statuses) {
//		console.log('statuses', statuses)
		if(err) return lastErrFn(err)
		
		var errorStatus = Status.makeError()
		  , hasError = false
		var datas = []
		
		for(var i in statuses) {
			var status = statuses[i]
//			console.log('s',status)
			if(status.isError()) {	
				hasError = true
				errorStatus.appendMessage('arg['+i+'] : '+status.message) 	
			}
			if(status.isSuccess()) {
				//all4promise에서 생성된 status라면 data만 반환 
				if(status.hasOwnProperty('data4all')) datas.push(status.data4all)
				else datas.push(status)
			}
		}
		if(hasError) 
			return lastErrFn(errorStatus.getMessage()) //에러처리함수로가자.
		else
			return lastDataFn(datas) //성공했을때만 성공함수로가고.
	}
}

function getContextAndAsyncMethod (contextAndAsyncMethod) {
	var context, asyncMethod;
	if(_.isFunction(contextAndAsyncMethod) ) {
		context = null;
		asyncMethod = contextAndAsyncMethod;
	}
	if(_.isArray(contextAndAsyncMethod)) {
		asyncMethod = contextAndAsyncMethod[1]
		context = contextAndAsyncMethod[0]
	}
	
//	console.log(asyncMethod)
	if(!_.isFunction(asyncMethod) ) return console.error('first arg should be async method ')
	
	return { 'context': context, 'asyncMethod': asyncMethod}
}
