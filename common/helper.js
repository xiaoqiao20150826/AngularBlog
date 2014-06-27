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
	    	return _asyncTemplate(_errFn, done, next);	    	 
	    }
	    ,doneOrErr : function(done, errFn) {
	    	errFn = errFn || _errFn;
	    	return _asyncTemplate(errFn,done,null);
	    }
		/* promise 사용위한 랩퍼 */
	    // then과 fail을 사용해서 직접 에러처리도 한다.
	    // 그렇기에 doneOrErr가 사용된 비동기함수에는 이것을 사용하면 안됨.
		,nfcall : function (_asyncFn /*...args*/) {
			var args = _.toArray(arguments);
			args.unshift(callback4defer);
			return _asyncCall4Promise.apply(null, args);
			
			function callback4defer(err, data) {//this가 deferred
				if(err) this.reject(err);
				if(H.exist(data)) this.resolve(data);  
			};
		}
		// doneOrErr로 에러처리한 비동기 함수 호출시 then만 사용한다.
		//그렇기에 콜백은 done이 되야함. exist도 doneOrErr로 검사되었다. 
		,call4done : function (_asyncFn /*...args*/) {
			var args = _.toArray(arguments);
			args.unshift(callback4defer);
			return _asyncCall4Promise.apply(null, args);
			
			function callback4defer(data) {
				console.log('args'+arguments);
				this.resolve(data); //this가 deferred 
			};
		}
		/* 비동기 함수 호출을 위한 루프 */
		//someList의 각 원소를 인자로하여 비동기함수를 수행한다
		//마지막에 done을 홀로 수행한다. done(errs, datas) 형태. 
		//context가 필요하면 사용자가 바인딩해서 넘겨줄것.
		//asyncFn는 (done, ...args) 형태를 가진다.
		,asyncLoop : function (someList ,asyncFn, done) {
			var context = null;
			if(asyncFn instanceof Array) {
				if(asyncFn.length > 1) context = asyncFn.shift();
				asyncFn = asyncFn.shift(); 
			}
			async.series(_.map(someList, _callback), done);
			function _callback(param) {
				return function(next) {
					asyncFn.apply(context, [__eachDone].concat(param));
					function __eachDone(data) {
						next(null, data);  //1: err, 2.data  results로 모아준다.
					};
				};
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
function _asyncTemplate(errFn, done, next) {
	return function (err, data) {
		if(H.exist(err)) errFn(err);
		if(H.exist(data) && done) {done(data);}
		else console.log('done이 없다. 올바른가?');   //아마 remove, connect, update 등에서 done을 전달안하고 사용했을거야. 아니면 wrapper사용안한것.일듯
		if(next) {next();};
	};
};
// 기본 에러 처리.
//TODO: 비동기 예외 핸들링 어떻게 하지?
function _errFn(err) {
	console.log('Err(default): '+ err);
	throw err;
	var errs = new Error(err);
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