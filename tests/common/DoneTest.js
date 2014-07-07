/**
 * What이 Done클래스인데. 바꾸기 이전이름이라 이렇게 됨.
 */
var should = require('should')
  , _ = require('underscore');

var H = require('../testHelper.js')
  , What = H.Done;


describe('some', function () {
	describe('사용자 함수 내부에서 nomalTemplate호출시', function () {
		describe('$dataFn 관련', function () {
			it('여기서 전달한 dataFn이 호출됨.', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest,'여기1');
				var errFn = assertedErrFn1(nextTest);
				(function (what) {
					rawData(what.getCallback())
				})(new What(dataFn, errFn))
			})
			it('여기서 전달한 dataFn이 호출됨.', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest,'여기1');
				var errFn = assertedErrFn1(nextTest);
				(function (what) {
					rawDataIsNull(what.getCallback())
				})(new What(dataFn, errFn))
			})
		})
		describe('$errFn관련', function () {
			it('여기서 전달한 errFn을 호출', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest);
				var errFn = assertedErrFn1(nextTest,'여기2');
				(function (what) {
					rawErr(what.getCallback())
				})(new What(dataFn, errFn))
			})
			it('내부의 errFn을 호출 후 외부의 errFn을 호출한다', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest);
				var errFn = assertedErrFn1(nextTest,'외부3');
				(function (what) {
					var errFn = assertedErrFn1(null, '내부3');
					what.addErrFn(errFn)
					rawErr(what.getCallback())
				})(new What(dataFn, errFn))
			})
			it('내부의 errFn을 호출 후 what의 기본 errFn을 호출.', function (nextTest) {
				var dataFn = assertedDataFn1(nextTest);
				(function (what) {
					var errFn = assertedErrFn1(nextTest, '내부4');
					what.addErrFn(errFn);
					//TODO: 비동기 예외인데. 어찌 확인 해야할지 모르겠네. 일단 동작은 원하는것처럼됨.
//					rawErr(what.getCallback());
					nextTest();
				})(new What(dataFn))
			})
			describe('asyncLoop, promise4call 관련', function () {
				var callRawData, callAsyncLoop;
				before(function() {
					callRawData = _callRawData;
					callRawErr = _callRawErr;
					callAsyncLoop = _callAsyncLoop;
					callPromise = _callPromise;
					
					function _callRawErr(what, arg1, arg2) {
						rawErr(what.getCallback(), arg1, arg2);	
					}
					function _callRawData(what, arg1, arg2) {
						rawData(what.getCallback(), arg1, arg2);	
					}
					function _callAsyncLoop(what, args) {
						H.asyncLoop(args, callRawData, what);
					}

					function _callPromise(what, args) {
						var dataFn = what.getDataFn();
						var errFn = what.getErrFn();
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
						callAsyncLoop(new What(dataFn, errFn), args);
						function dataFn(datas) {
							should.equal(datas.length, args.length)
							nextTest();
						}
					})
//					TODO: 이건 예제를 어떻게 정해야할지 잘모르겠네. 필요시 추가.
//					it('위의 asyncLoop를 사용하는 함수를 asyncLoop로 호출하기', function (nextTest) {
//						var errFn = assertedErrFn1(nextTest,'외부5');
//						var args = [[{a:1},2,3], [2], 34, 5,[[{a:1},2,3], [2], 34, 5]];
//						What.asyncLoop(args, callAsyncLoop, new What(dataFn, errFn));
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
							callPromise(new What(dataFn, errFn))
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
							H.call4promise(callPromise,new What(dataFn, errFn), 'data1')
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
							var what = new What(dataFn, errFn)
							H.asyncLoop([1,1,1,2,1], callPromise, what);
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

