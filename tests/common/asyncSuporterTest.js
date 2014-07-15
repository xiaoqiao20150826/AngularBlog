/**
 *  asyncSuporter.js 일부 테스트
 */

var asyncSuporter = require('../../common/asyncSuporter.js')
  , Done = asyncSuporter.Done
  , U = require('../../common/util/util.js')
  , _ = require('underscore')
  , should = require('should');

describe('asyncSuporter', function () {
	describe('#call4promise with asyncFn', function() {
		it('should take args when call4promise', function () {
			asyncSuporter.call4promise(args,1,2,3,4,5);
			function args(done, a, b, c, d, e) {
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
		//then에서 프로마이즈를 리턴하지 않는다면 성공한
		it('성공한 then은 다음것도 계속 호출될 것이다. ', function (asyncDone) {
			asyncSuporter.call4promise(returnData)
			.then(function(data) {})
			.then(function(data) {})
			.then(function(data) {})
			.then(function(data) {asyncDone() })//
		});
		it('중간에 호출을 끊고 싶어. ', function (asyncDone) {
			asyncSuporter.call4promise(returnData)
			.then(function(data) {return null})
			.then(function(data) {
				if(data == undefined) {asyncDone();}
				else console.log('2222')
			})
			.then(function(data) {assert.fail()})
			.then(function(data) {})//
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
			asyncSuporter.asyncLoop(a_args , returnData, new Done(endDone, asyncDone))
			function endDone(datas) {
				should.equal(a_args[0].toString(), datas[0].toString());
				asyncDone();
			}
		});
	})
});

/* asyncFns for test using asyncSuporter.getCallbackTemplate */
function throwErr(done /* ... args*/) {
	var callback = done.getCallback()
		, args = _.toArray(_.rest(arguments));
	setTimeout(function () {
		var err = 'throwErr'
		  , data = 'callback data, args : '+ args ;
		callback(err, data);
	}, 100);
};

var count = 0;
function returnData(done /* ... args*/) {
	var callback = done.getCallback()
	  , args = _.toArray(_.rest(arguments));
	setTimeout(function () {
		var err = null
//		, data = 'callback data, args : '+args +' count : '+ (++count) ;
		,data = args;
		callback(err, data);
	}, 100);
};


// wrap
