/**
 *  asyncSuporter.js 일부 테스트
 */

var asyncSuporter = require('../../common/asyncSuporter.js')
  , U = require('../../common/util/util.js')
  , _ = require('underscore')
  , should = require('should');

describe('asyncSuporter', function () {
	describe('#call4promise with asyncFn', function() {
		it('should take args when call4promise', function () {
			asyncSuporter.call4promise(args,1,2,3,4,5);
			function args(doneOrErrFn, a, b, c, d, e) {
//				console.log(a,b,c,d,e,''+done);
				should.equal(e, 5)
			};
		});
		it('should catch err with call4promise', function (asyncDone) {
			asyncSuporter.call4promise(throwErr)
			 .then(function(data) {
				 should.fail('must dont run');
			 })
			 .catch(function(err) {
				 should.exist(err);
				 asyncDone();
			 });
		});
		it('should catch err with call4promise2', function (asyncDone) {
			asyncSuporter.call4promise(returnData)
			 .then(function(data) { return asyncSuporter.call4promise(returnData);})
			 .then(function(data) { return asyncSuporter.call4promise(throwErr);})
			 .then(function(data) { return asyncSuporter.call4promise(returnData);})
			 .catch(function(err) {
						should.exist(err);
						asyncDone();
				    });
		});
		// then 코드내에 에러가 있다면?(throw, 오타, 정의되지않은 변수)
		it('should catch err with err in fn of then', function (asyncDone) {
			// catch로 에러처리를 한다면 잡히지 않지만
			// then에 전달되는 함수에 try~catch가 되어있으리라 추정됨. 캐취되면 나중에 catch함수에 전달하고.
			asyncSuporter.call4promise(returnData)
			 .then(function(data) {
					 enk();
					 gnkr;
					 throw 'err in conde';
					 console.log('not call');
					 return asyncSuporter.call4promise(returnData);
				   })
			 .then(function(data) { return asyncSuporter.call4promise(returnData);})
			 .then(function(data) { return asyncSuporter.call4promise(throwErr);})
			 .then(function(data) { return asyncSuporter.call4promise(returnData);})
			 .catch(function(err) {
						should.exist(err);
						asyncDone();
				    });
		});
	});
	describe('#asyncLoop' , function() {
		it('should run', function (asyncDone) {
			var a_args = [[{a:1},2,3], [2], 34, 5];
			asyncSuporter.asyncLoop(a_args , returnData, endDone, asyncDone)
			function endDone(err, datas) {
				should.equal(a_args[0].toString(), datas[0].toString());
				asyncDone(err);
			}
		});
		it('should run', function (asyncDone) {
			var a_args = [1,2,3,4]
			asyncSuporter.asyncLoop(a_args , promiseFn, endDone, asyncDone)
			function endDone(err, datas) {
				should.equal(a_args[0].toString(), datas[0].toString());
				asyncDone(err);
			}
		});
		//시퀀스 테스트에 있는 건데 예제용으로...
//		it('여러번 호출시 값 일치하는지 확인',function (asyncDone) {
//			H.asyncLoop([1,1,1,1] , [_seq,_seq.getNext], endDone, asyncDone)
//				function endDone(err, results) {
//	  				var seqObj = results.pop();
//	  				should.equal(seqObj.seq, 4);
//	  				asyncDone(err);
//				}
//		});
	})
	//모든 비동기 호출 함수는 done과 errFn을 첫 파라미터로 받는다.
	describe('#getCallbackTemplate', function() {
		it('배열로 done, err를 전달할 수 있다.', function(asyncDone) {
			returnData(asyncSuporter.doneOrErrFn(done,errFn),1,2,3,4 );
			function errFn(err) {
				should.not.exist(err);
				asyncDone(err)
			}
			function done(data) {
				_.isEqual(data, [1,2,3,4]).should.be.true;
//				console.log('data : ' +data)
				asyncDone();
			}
		});
		it('template이름이 포함된 함수라면 그대로 반환되야 한다.', function () {
			var e_fn = asyncSuporter.getCallbackTemplate(aseftemplate);
//			console.log(e_fn.name);
			should.equal(e_fn.name, aseftemplate.name);
			function aseftemplate() {
			}
		})
		it('[done, err]나 done 가 전달된다면 asyncTemplate가 반환되야한다.', function () {
			var e_fn = asyncSuporter.getCallbackTemplate(done);
			var e_fn2 = asyncSuporter.getCallbackTemplate([done,err]);
//			console.log(e_fn.name);
//			console.log(e_fn2.name);
			should.equal(e_fn.name,e_fn2.name);
			function done(data) {};
			function err(err) {};
		})
	});
	describe('promiseFn', function() {
		it('should do done', function(async) {
			var arg = [2,3];
			promiseFn(asyncSuporter.doneOrErrFn(done), arg);
			function done(data) {
				should.deepEqual([arg],data);
				async();
			}
		});
		it('should catch err', function(async) {
			var arg = [2,3];
			promiseFnErr(asyncSuporter.doneOrErrFn(done,errFn), arg);
			function done(data) {}
			function errFn(err) {
				should.equal(err, 'throwErr');
				async();
			}
		});
		it('should run with call4promise', function(async) {
			// 다른 검사는 없고.. 무사히 endDone 호출되는지 확인만 함.
			// TODO: 형태를 가다듬어야한다. done이 promise에서도 필수이면... 불편해.
			var arg = [2,3];
			var arg2 = [3,4,5];
			promiseFn(asyncSuporter.doneOrErrFn(next,errFn), arg)
				     .then(endDone)
					 .catch(errFn);
			function next(data) {
//				console.log('next ; ' + data)
				return promiseFn(asyncSuporter.doneOrErrFn(function(){},errFn), arg2)
			}
			function endDone(data) {
				async();
			}	
			function errFn(err) {
				async();
			}
		});
		
	})
});

/* asyncFns for test using asyncSuporter.getCallbackTemplate */
function throwErr(doneOrErrFn /* ... args*/) {
	var callback = asyncSuporter.getCallbackTemplate(doneOrErrFn)
		, args = _.toArray(_.rest(arguments));
	setTimeout(function () {
		var err = 'throwErr'
		  , data = 'callback data, args : '+ args ;
		callback(err, data);
	}, 100);
};

var count = 0;
function returnData(doneOrErrFn /* ... args*/) {
	var callback = asyncSuporter.getCallbackTemplate(doneOrErrFn)
	  , args = _.toArray(_.rest(arguments));
	setTimeout(function () {
		var err = null
//		, data = 'callback data, args : '+args +' count : '+ (++count) ;
		,data = args;
		callback(err, data);
	}, 100);
};

function promiseFn(doneOrErrFn, arg) {
	var done = doneOrErrFn.done
	  , errFn = doneOrErrFn.errFn || U.defaultCatch;
	
	
	return asyncSuporter.call4promise(returnData)
						 .then(function(data) { return asyncSuporter.call4promise(returnData);})
						 .then(function(data) { return asyncSuporter.call4promise(returnData);})
						 .then(function(data) { return asyncSuporter.call4promise(returnData,arg);})
						 .then(done)
						 .catch(errFn);
}
function promiseFnErr(doneOrErrFn, arg) {
	var done = doneOrErrFn.done
	  , errFn = doneOrErrFn.errFn || U.defaultCatch;
	
	return asyncSuporter.call4promise(returnData)
				 .then(function(data) { return asyncSuporter.call4promise(returnData);})
				 .then(function(data) { return asyncSuporter.call4promise(throwErr);})
				 .then(function(data) { return asyncSuporter.call4promise(returnData,arg);})
				 .then(done)
				 .catch(errFn);
}

// wrap
