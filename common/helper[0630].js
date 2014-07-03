/**
 * helper
 */

// db callback helper
var _ = require('underscore')
	,Q = require('q')
	,async = require('async');

var H = module.exports = {
		/* 비동기함수를 한번 호출할 경우 간편하기 하기위함. 함수내에서 직접 에러처리를 한다 */
	    doneOrNext : function (done,next) {
	    	done = done || function(){};
	    	return _asyncTemplate3(_errFn, done, next);	    	 
	    }
	    ,doneOrErr : function (done, errFn) {
	    	errFn = errFn || _errFn;
	    	if(isFnForPromise(done) || isAsyncTemplate(done)) return done;
	    	else return _asyncTemplate3(errFn,done,null);
	    	
	    	/* 중요 */
	    	//비동기 함수의 내부가 아닌 외부에서 에러처리 함수를 전달할 경우 필요하다.
	    	//nfcall의 내부의 콜백함수를 알아야 doneOrErr의 랩핑을 원상복귀할수있다.
	    	function isFnForPromise(fn) {
	    		return _isFnAndRightName(fn, 'promise');
	    	}
	    	//비동기 함수 호출시 외부에서 catch를 할 경우
	    	function isAsyncTemplate(fn) { 
	    		return _isFnAndRightName(fn, 'asyncTemplate');
	    	}
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
	    // helperTest를 참고하시옹.
	    // then, catch로 외부에서 콜백함수를(doneFn, errFn) 을 받는다.
		,nfcall : function (_asyncFn /*...args*/) {
			var context , asyncFn, args, deferred;
			args = _.toArray(_.rest(arguments));
			args.unshift(callback4promise);//
			deferred = Q.defer();
			
			asyncFn = _asyncFn;
			if(_asyncFn instanceof Array) {
				if(_asyncFn.length > 1) context = _asyncFn.shift();
				else context = null;
				asyncFn = _asyncFn.shift(); 
			}
			asyncFn.apply(context, args);
			return deferred.promise;
			
			function callback4promise(err, data) {//this가 deferred
				if(err) deferred.reject(err);
				if(H.exist(data)) deferred.resolve(data);
				//err,data둘다 없으면...무슨상황인걸까.
			};
		}
		/* 비동기 함수 호출을 위한 루프 */
		//1) someList의 각 원소를 인자로하여 비동기함수를 수행한다
		//2) 모든 호출 후  done을 수행한다. 각 비동기함수에서 수행된 datas가 인자로 전달된다. 
		//3) 수행될 비동기 함수는 asyncFn(done, ...args) 시그니쳐를 가진다.(context 바인딩가능)
		//  ** __eachDone이 data만을 가지는 이유는 asyncFn이 done만을 받기 때문이다.(즉, err처리는 비동기 함수 내부에서 수행된다).
		,asyncLoop : function (someList ,asyncFn, done) {
			var context = null;
			if(asyncFn instanceof Array) {
				if(asyncFn.length > 1) context = asyncFn.shift();
				asyncFn = asyncFn.shift(); 
			}
			async.series(_.map(someList, _callback), _done4series)
			function _callback(param) {
				return function(saveArgs) {
					asyncFn.apply(context, [__eachDone].concat(param));
					function __eachDone(data) {
						//args 저장 후 다음 비동기 함수 수행.
						//saveArgs는 err, data를 인자로 가지는 함수임.
						saveArgs(null,data); 
					};
				};
			}
			//err처리는 각함수에 맡기므로 모두 성공하였을 경우만 마무리함수가 수행됨.
			function _done4series(errs, datas) {
				done(datas);
			}
		}
		/* 편의함수 */
		//하나라도 존재하지 않으면 false;
		,exist : function(o) { //0일경우 실패해서.. , '' 일경우는??
			if(!(o instanceof Array)) {return _existOne(o);} 
			else {
				for(var i in o) {
					if(!(_existOne(o[i])) ) return false;
				}
			}
			return true;
		}
		// _.clone가 object clone시 hasOwnProperty체크를 안해서 __proto 링크의 프로퍼티까지 복사해버린다. 
		// 깊은 복사
		,deepClone : function (obj) {
			return _deepClone(obj);
		}
		// target의 필드에 해당하는 값이 source에 있다면
		// 그 값을 deepClone해서 target에 할당한다.
		// sideEffect function. 
		,cloneAboutTargetKeys : function (target, source) {
			for(var key in target) { 
				var value = source[key];
				if(H.exist(value)) {
					target[key] = H.deepClone(value);
				}
			}
			return target;
		}
		
		/* 편의함수중에서도.. 기타등등 */
		,defaultCatch : function (err) {
			_errFn(err);
		}
};
///////---------- private 함수
// 비동기 함수의 콜백형식을 간편히 하기 위해 구조와 호출될 함수를 정해놓는다.
// data가 0일 경우 if(0)을 회피하기위해 exist필요.
function _asyncTemplate3(errFn, done, next) {
	return function asyncTemplate(err, data) {
		if(H.exist(err)) return errFn(err);
		
		if(H.exist(data) && done) {return done(data);}
		else console.log('done이 없다. 올바른가?');   //아마 remove, connect, update 등에서 done을 전달안하고 사용했을거야. 아니면 wrapper사용안한것.일듯
		
		if(next) return next();
	};
};
// 기본 에러 처리.
//TODO: 비동기 예외 핸들링 어떻게 하지?
function _errFn(err) {
//	console.log('Err(default): ' + err);
	throw 'Err(default): ' + err;
}
// promise async call
// callback를 첫번째인지, 마지막인지 중요하다.
// 몽구스 스타일은 마지막  나는 첫번째로 했다. 현재 첫번째로 되어있기에 몽구스 함수를 nfcall로 프로마이즈를 인자가 제대로 전달되지 않는다.
function _asyncCall4Promise(_callback ,_asyncFn /*...args*/) {
	var callback, context , asyncFn, args, deferred;
	deferred = Q.defer();
	callback = _callback.bind(deferred);
	asyncFn = _asyncFn;
	args = _.toArray(_.rest(_.rest(arguments)));
	args.unshift(callback);// 
	if(_asyncFn instanceof Array) {
		if(_asyncFn.length > 1) context = _asyncFn.shift();
		else context = null;
		asyncFn = _asyncFn.shift(); 
	}
	
	asyncFn.apply(context, args);
	return deferred.promise;
	
}
function _existOne(o) {
	if(o != null && o != undefined) return true;
	else return false;
};
//clone
function _deepClone(obj) {
	// Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = _deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = _deepClone(obj[attr]);
        }
        //이걸 참조로 유지하면...음..영향이 어떨지.?
        copy.__proto__ = obj.__proto__;
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}