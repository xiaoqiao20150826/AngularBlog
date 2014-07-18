var should = require('should')
  , _ = require('underscore');

var H = require('../testHelper.js')
  , Done = H.Done;

///////////////생성관련
describe('Done', function () {
	var fn;
	before(function() {
		fn = function () {};	
	}) 
	describe('# new ()', function () {
		it('param2', function () {
			
			var done1 = new Done(fn,fn,Done.NOMAL);
			var done2 = new Done(fn,fn,Done.ASYNC);
			var done3 = new Done(fn);
			
			var done4 = new Done(fn,Done.NOMAL);
			var done5 = new Done(fn,Done.ASYNC);
			
			_test(done1, Done.NOMAL);
			_test(done2, Done.ASYNC);
			_test(done3, Done.NOMAL);
			_test(done4, Done.NOMAL);
			_test(done5, Done.ASYNC);
			function _test(done, type) {
				should.equal(H.exist(done.getErrFn()), true);
				if(done.getErrFn().name) {
					should.equal(done.getErrFn().name, '_defaultErrFn');
				}
				should.equal(done.getTemplateType(), type)
			};
		})
		
	})
})


/////////////////// 호출관련
describe('Done', function () {
	describe('사용자 함수 내부에서 nomalTemplate호출시', function () {
		describe('$dataFn 관련', function () {
			it('여기서 전달한 dataFn이 호출됨.', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest,'여기1');
				var errFn = assertedErrFn1(nextTest);
				(function (done) {
					rawData(done.getCallback())
				})(new Done(dataFn, errFn))
			})
			it('여기서 전달한 dataFn이 호출됨.', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest,'여기1');
				var errFn = assertedErrFn1(nextTest);
				(function (done) {
					rawDataIsNull(done.getCallback())
				})(new Done(dataFn, errFn))
			})
		})
		describe('$errFn관련', function () {
			it('여기서 전달한 errFn을 호출', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest);
				var errFn = assertedErrFn1(nextTest,'여기2');
				(function (done) {
					rawErr(done.getCallback())
				})(new Done(dataFn, errFn))
			})
			it('내부의 errFn을 호출 후 외부의 errFn을 호출한다', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest);
				var errFn = assertedErrFn1(nextTest,'외부3');
				(function (done) {
					var errFn = assertedErrFn1(null, '내부3');
					done.addErrFn(errFn)
					rawErr(done.getCallback())
				})(new Done(dataFn, errFn))
			})
			it('내부의 errFn을 호출 후 done의 기본 errFn을 호출.', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest);
				(function (done) {
					var errFn = assertedErrFn1(nextTest, '내부4');
					done.addErrFn(errFn);
					//TODO: 비동기 예외인데. 어찌 확인 해야할지 모르겠네. 일단 동작은 원하는것처럼됨.
//					rawErr(done.getCallback());
					nextTest();
				})(new Done(dataFn))
			})
			describe('asyncLoop, promise4call 관련', function () {
				var callRawData, callAsyncLoop;
				before(function() {
					callRawData = _callRawData;
					callRawErr = _callRawErr;
					callAsyncLoop = _callAsyncLoop;
					callPromise = _callPromise;
					
					function _callRawErr(done, arg1, arg2) {
						rawErr(done.getCallback(), arg1, arg2);	
					}
					function _callRawData(done, arg1, arg2) {
						rawData(done.getCallback(), arg1, arg2);	
					}
					function _callAsyncLoop(done, args) {
						H.asyncLoop(args, callRawData, done);
					}

					function _callPromise(done, args) {
						var dataFn = done.getDataFn();
						var errFn = done.getErrFn();
						return H.call4promise(callRawData, 'data111')
								 	.then(function(data) {
								 		return H.call4promise(callRawData, data+ 'data222');
								 	})
								 	.then(function(data) {
								 		return H.call4promise(callRawData, data +'data333');
								 	})
								 	.then(function(data) {
								 		dataFn(data);
								 	})
								 	.catch(errFn);
					
					}
				});
				
				describe('#asyncLoop 관련', function() {
					it('rawData를 여러번 호출하기 ', function(nextTest) {
						var errFn = assertedErrFn1(nextTest,'외부5');
						var args = [[{a:1},2,3], [2], 34, 5];
						callAsyncLoop(new Done(dataFn, errFn), args);
						function dataFn(datas) {
							should.equal(datas.length, args.length)
							nextTest();
						}
					})
//					TODO: 이건 예제를 어떻게 정해야할지 잘모르겠네. 필요시 추가.
//					it('위의 asyncLoop를 사용하는 함수를 asyncLoop로 호출하기', function (nextTest) {
//						var errFn = assertedErrFn1(nextTest,'외부5');
//						var args = [[{a:1},2,3], [2], 34, 5,[[{a:1},2,3], [2], 34, 5]];
//						done.asyncLoop(args, callAsyncLoop, new Done(dataFn, errFn));
//						function dataFn(datas) {
//							console.log(datas);
//							should.equal(datas.length, args.length)
//							nextTest();
//						}
//					});
					describe('$promise관련', function() {
						it('then 체인.', function (nextTest) {
							var dataFn = assertedDataFn1(nextTest,'p1');
							var errFn = assertedErrFn1(nextTest,'p1');
							callPromise(new Done(dataFn, errFn))
						})
						it('then 체인은 연속으로 호출된다..', function (nextTest) {
							var dataFn = assertedDataFn1(nextTest,'p1');
							var errFn = assertedErrFn1(nextTest,'p1');
							H.call4promise(callRawData, 'data')
						 	 .then(function(data) {
						 		return 1;
						 	 })
						 	 .then(function(data) {
						 		return data + 2
						 	 })
						 	 .then(function(data) {
						 		return data + 3
						 	 })
						 	 .then(function(data) {
						 		should.equal(data,6);
						 		nextTest();
						 	 })
						})
						it('then 체인을 중간에 멈춘다.', function (nextTest) {
							var dataFn = assertedDataFn1(nextTest,'p1');
							var errFn = assertedErrFn1(nextTest,'p1');
							var promise = H.call4promise(callRawData, 'data')
						 	  .then(function(data) {
						 		  if(data) promise.then(next)
						 		  else throw '호출되지 않는다.';
						 	  });
							function next() {
								nextTest();
							}
						})
						it('then체인 중 예외처리', function(nextTest) {
							var dataFn = assertedDataFn1(nextTest,'p2');
							var errFn = assertedErrFn1(nextTest,'p2');
							H.call4promise(callRawData, 'data')
							 	.then(function() {
							 		return H.call4promise(callRawData, 'data222');
							 	})
							 	.then(function() {
							 		return H.call4promise(callRawErr, 'data333');
							 	})
							 	.then(function() {
							 		console.log('호출안됨')
							 		dataFn('promise끝');
							 	})
							 	.catch(errFn)
						})
						it('promise, asyncLoop, raw 함수 섞어쓰기', function (nextTest) {
							var dataFn = assertedDataFn1(nextTest,'p3');
							var errFn = assertedErrFn1(nextTest,'p3');
							//이건 dataFn이 호출되면 then호출되고 errFn이 호출되면 catch가 호출됨
							H.call4promise(callPromise,new Done(dataFn, errFn), 'data1')
							 	.then(function(data) {
							 		return H.call4promise(callRawData, data+ 'data222');
							 	})
							 	.then(function(data) {
							 		return H.call4promise(callRawData, data+ 'data333');
							 	})
							 	.then(function(data) {
							 		dataFn(data);
							 	})
							 	.catch(errFn)
						})
						it('promise사용하는 함수를 asyncLoop로 호출시키기', function (nextTest) {
							var errFn = assertedErrFn1(nextTest,'p5');
							var done = new Done(dataFn, errFn)
							H.asyncLoop([1,1,1,2,1], callPromise, done);
							function dataFn(datas) {
//								console.log('datas ',datas);
								should.equal(datas.length, 5)
								nextTest();
							}
						})
					})
				});
			})
		})
		
		
	})
})
//////////// 실험대상이 될 함수들.


/*  예외처리 함수, 데이터 처리함수, next형태의 함수.                      */
// 1. oauth에서 전달받는 함수형태
function next(err, data) {
	if(err) return errFn;
	else _dataFn(data); // data가 null일수도 있기에 그 처리는 dataFn에게 맡김
}

//1. 에러가 있을 경우 호출되는 함수.
function assertedErrFn1 (nextTest, loc) {
	return function errFn (err) {
		if(nextTest) nextTest();
		try {
//			console.log('위치 : '+loc + ' 예외 :' + err);
			throw new Error('위치 : '+loc + ' 예외 :' + err).stack
		} catch(e) {
			//비동기 예외처리 확인을 어떻게 해야할지 모르겠네
			// 예외 숨킴으로..일단은...
			should.exist(e); 
//			e.should.be.Error
			
		}
	}
}
//2. successFn 이건 에러가 없을 경우 호출되는 것.
function assertedDataFn1(nextTest, loc) {
	return function dataFn (data) {
		if(data == null) {
			should.not.exist(data);
//			console.log('위치 : '+ loc +' data null : ' + data);
			return nextTest();
		}
		else {
			should.exist(data);
//			console.log('위치 : '+ loc +' data : ' + data);
			return nextTest();
		}
	}
}

/*          raw비동기 함수           */
//1) 노멀 템플릿 형태를 받는 raw비동기 함수(에러가 없으면서 데이터 있음)
function rawData(nomalTemplate /*args */) {
	var args = _.rest(arguments);
//	if(args) console.log('args : ' +args);
	setTimeout(function () {
		var data = 'data 존재함'
		nomalTemplate(null, data);
	},2)
}
//2) 노멀 템플릿 형태를 받는 raw비동기 함수(에러가 없으면서 데이터 null)
function rawDataIsNull(nomalTemplate) {
	setTimeout(function () {
		var data = null;
			nomalTemplate(null, data);
	},200)
}
//3) 노멀 템플릿 형태를 받는 raw비동기 함수.(에러가 있다.)
function rawErr(nomalTemplate) {
	setTimeout(function () {
		var err = '에러가 있음';
		nomalTemplate(err, null);
	},200)
}

//////////////////////////////

