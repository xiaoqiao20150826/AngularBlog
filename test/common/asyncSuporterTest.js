/**
 *  asyncSuporter.js 일부 테스트
 */

var debug = require('debug')('test:common:asyncSuporter')
  , log = console.log 
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
		it('should catch err with call4promise', function (nextTest) {
			asyncSuporter.call4promise(throwErr)
			.then(function(data) {
				should.fail('must dont run');
			})
			.catch(function(err) {
				should.exist(err);
				nextTest();
			});
		});
		//then에서 프로마이즈를 리턴하지 않는다면 성공한
		it('성공한 then은 다음것도 계속 호출될 것이다. ', function (nextTest) {
			asyncSuporter.call4promise(returnData)
			.then(function(data) {})
			.then(function(data) {})
			.then(function(data) {})
			.then(function(data) {nextTest() })//
		});
		it('중간에 호출을 끊고 싶어. ', function (nextTest) {
			asyncSuporter.call4promise(returnData)
			.then(function(data) {return null})
			.then(function(data) {
				if(data == undefined) {nextTest();}
				else console.log('2222')
			})
			.then(function(data) {assert.fail()})
			.then(function(data) {})//
		});
		it('should catch err with call4promise2', function (nextTest) {
			asyncSuporter.call4promise(returnData)
			 .then(function(data) { return asyncSuporter.call4promise(returnData);})
			 .then(function(data) { return asyncSuporter.call4promise(throwErr);})
			 .then(function(data) { return asyncSuporter.call4promise(returnData);})
			 .catch(function(err) {
						should.exist(err);
						nextTest();
				    });
		});
		// then 코드내에 에러가 있다면?(throw, 오타, 정의되지않은 변수)
		it('should catch err with err in fn of then', function (nextTest) {
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
						nextTest();
				    });
		});
	});
	describe('#asyncLoop' , function() {
		var successFn1,successFn2, successFn3, successFn4
		var failFn1, failFn2;
		before(function() {
			successFn1 = asyncFn1(true)
			successFn2 = asyncFn1(true)
			successFn3 = asyncFn1(true)
			successFn4 = asyncFn1(true)
			failFn1 = asyncFn1()
			failFn2 = asyncFn1()
		})
		
		it('should run', function (nextTest) {
			var a_args = [[{a:1},2,3], [2], 34, 5];
			asyncSuporter.asyncLoop(a_args , returnData, new Done(endDone, nextTest))
			function endDone(datas) {
				should.equal(a_args[0].toString(), datas[0].toString());
				nextTest();
			}
		});
		it('#all should endDataFn call after all success', function (nextTest) {
			var errFn = function() {console.error('err',arguments); nextTest()}
			  , done = new Done(endDataFn, errFn);
			asyncSuporter.all( new Done(endDataFn, errFn)
							 , [    successFn1
							     , [successFn2 ,1]
							     , [successFn3 ,2,3]							   
							 	 , [successFn3 ,4,5,6]							   
							   ]
							 )
			function endDataFn(args) {
				should.equal(args[0], null)
				should.equal(args[1], 1)
				should.deepEqual(args[2], [2,3])
				should.deepEqual(args[3], [4,5,6])
				nextTest();
			}
		})
		it('#all4promise should endDataFn call after all success', function (nextTest) {
			asyncSuporter.all4promise([ successFn1
							          , [successFn2 ,1]
									  , [successFn3 ,2,3]							   
									  , [successFn3 ,4,5,6]							   
					    			  ])
					    			  .then(endDataFn)
			function endDataFn(args) {
				should.equal(args[0], undefined)
				should.equal(args[1], 1)
				should.deepEqual(args[2], [2,3])
				should.deepEqual(args[3], [4,5,6])
				nextTest();
			}
		})
		it('should catch error ', function (nextTest) {
			var errFn = function() {nextTest()}
     			, done = new Done(endDataFn, errFn);
			asyncSuporter.all( done
							  , [ successFn1
							    , failFn1
							    , successFn1
							    , successFn1
							    ]
			)
			function endDataFn() {throw 'eee'}
		})
		it('should catch error ', function (nextTest) {
			asyncSuporter.all4promise([ successFn1
								      , failFn1
								      , successFn1
								      , successFn1
								    ])
								     .then(function() {throw 'eee'})
								     .catch(function(){nextTest()})
		})
		
	})
	//졸려서 좀  대충만듬......
	describe('#syncAll4promise', function () {
		successFn = asyncFn1(true)
		it('should success',function (nextTest) {
			asyncSuporter.syncAll4promise([  [successFn , 3]
									       , [successFn, 4]
									       , [successFn, 5]
									       , [successFn, 6]
									     ])
									     .then(function (args) {
//									    	 console.log(args)
									    	 should.equal(args[2], 5)
									    	 nextTest()
									     })
		})

		
	})
	describe('#bindRest' , function() {
		it('should call binded function from args and context', function () {
			var context = { name: 'context' 
				           , fn : function (done, arg1, arg2, arg3) {
				        	   		var result = ''
				        	   		if(this.name) { result = this.name;}
				        	   		
				        	   		return result+ (done instanceof Done) + arg1+arg2+arg3;
				           	    }
						   }	
			var bindedMethod = asyncSuporter.bindRest([context, context.fn],11,22,33)
			var bindedMethod2 = asyncSuporter.bindRest(context.fn, 11,22,33)
			var result1 = bindedMethod(Done.makeEmpty(), '나머지는 위에서 바인드되었기에 무시.')
			var result2 = bindedMethod2(Done.makeEmpty(), '나머지는 위에서 바인드되었기에 무시.')
			should.equal(result1, 'contexttrue112233')
			should.equal(result2, 'true112233')
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
		  , data = args
		callback(err, data);
	}, 100);
};
function asyncFn1(isSuccess, delay) {
	isSuccess = isSuccess || false;
	delay = delay || Math.round(Math.random()*100)
	
	return function returnData(done /* ... args*/) {
		var dataFn = done.getDataFn()
		  , errFn = done.getErrFn()
		  , args = _.toArray(_.rest(arguments));
		
		setTimeout(function () {
			if(!isSuccess) 
				return errFn('error');
			else
				return dataFn.apply(null, args)
		}, delay);
	};
}

// wrap
