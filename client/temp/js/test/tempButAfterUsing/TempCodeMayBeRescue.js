/**
 *  재활용될수도 있는 코드. 참조할수있는
 */


						//JAVASCIRPT
//var SELECTED = 'selected';
//selectedOne : function ($btn) {
//	var className = 'selected';
//	pager.addClassToOneOfSiblings($btn, className);
//},
//get$selctedBtn : function (btnClassName) {
//	if(!(btnClassName.charAt(0) == '.')) btnClassName = '.'+btnClassName;
//	var className4selector = btnClassName+'.selected';
//	return $(className4selector);
//},
//addClassToOneOfSiblings : function ($btn, className) {
//	$btn.addClass(className);
//	var $siblingTapBtns = $btn.siblings();
//	$siblingTapBtns.removeClass(className);
//},


////TODO: 이건 동기식호출이나 다름없어...그럴필요가없는데. 비효율적이야. 사용안할예정.
//moduleLoader.loadMany = function(endDone, paths) {
//	if(paths.length < 1) throw console.error('paths must not empty');
//	
//	var loadOne = this.loadOne
//	  , curIndex = 0 
//	  , endIndex = paths.length-1;
//	
//	nextCall(null);
//	function nextCall(a, status) {
//		if(status=='error') throw console.error(a);
//		if(curIndex==endIndex) nextCall = endDone;
//		
//		var path = paths[curIndex++];
//		return loadOne(nextCall, path)
//	}
//}

////////////////       상태에따른 비동기 로딩인데 로딩 후 '기다림'을 구현못해서 방치됨.       
//	moduleLoader.loadByModulePathOfPackage = function (done, modulePathOfPackage, startTime) {
//		var moduleManager = moduleLoader.moduleManager
//		  , module = moduleManager.getModule(modulePathOfPackage)
//		  , modulePath = module.getPath();
//		
//		if(isTimeOut(new Date()) ) return done(moduleManager.makeEmptyCurrentStatus('err : timeout'));
//		
//		if(module.isError()) return done(moduleManager.getCurrentStatus());
//		if(module.isReady()) return moduleLoader.loadManyByReadyModules(done, modulePathOfPackage);
//		if(module.isStart()) return moduleLoader.loadManyByReadyModules(done, modulePathOfPackage);
//		if(module.isLoading()) return moduleLoader.loadManyByReadyModules(done, modulePathOfPackage);
//		if(module.isSuccess()) return done(module);
//	}
//	
//	moduleLoader.loadManyByReadyModules = function (done, modulePathOfPackage) {
//		var moduleManager = moduleLoader.moduleManager
//		  , Status = moduleManager.Status
//		  , readyModulePaths = moduleManager.getModulePathsByStatus(Status.READY);
//		
//		if(readyModulePaths.length == 0) {//없다면
//			lastEndDone(moduleManager.getCurrentStatus());
//		}
//		else {
//			moduleLoader.loadMany(lastEndDone, readyModulePaths);
//		}
//		function lastEndDone(currentStatus) {
//			if(currentStatus.isError()) return done(currentStatus);
//			
//			setTimeout(function() {
//				return moduleLoader.loadByModulePathOfPackage(done, modulePathOfPackage)
//			},200);
//		}
//	}


					// 위에 대한 테스트코드
//describe('#loadByModulePathOfPackage', function () {
//			var modulePathOfPackage = 'com.kang.namespace.testForModuleLoaderTest'
//			var modulePath = './namespace/testForModuleLoaderTest.js'
//			var modulePath2 = './namespace/testForModuleLoaderTest2.js'
//			var modulePath3 = './namespace/testForModuleLoaderTest3.js'
//			it('should throw err', function() {
//				var modulePathOfPackage = 'com.kang.test'
//				expect(function () {
//					moduleLoader.loadByModulePathOfPackage(null, modulePathOfPackage);
//				}).throw(/not found Similaire/);
//			})
//			it('should run with ready', function (nextTest) {
//			    moduleManager.ready(modulePath);
//			    moduleLoader.loadByModulePathOfPackage(done, modulePathOfPackage);
//			    function done(currentStatus) {
//			    	expect(moduleManager.getCurrentStatus().status).to.equal('success');
//			    	nextTest();
//			    }
//			})
//			it('should take timeout with start', function (nextTest) {
//				moduleManager.removeAll();
//				moduleManager.start(modulePath)
//				moduleLoader.loadByModulePathOfPackage(done, modulePathOfPackage);
//			    function done(currentStatus) {
//			    	var status = currentStatus.status.match(/timeout/) ? true : false
//			    	expect(status).to.equal(true);
//			    	nextTest();
//			    }
//			});
//			// 시간지나고 상태를 바꿔서 테스트.
//			it('should run with start', function (nextTest) {
//				moduleManager.removeAll();
//				moduleManager.start(modulePath)
//				moduleLoader.loadByModulePathOfPackage(done, modulePathOfPackage);
//				setTimeout(function() {
//					moduleManager.ready(modulePath)
//					moduleManager.ready(modulePath2)
//					moduleManager.ready(modulePath3)
//				},300);
//				function done(currentStatus) {
//			    	expect(moduleManager.getCurrentStatus().status).to.equal('success');
//					nextTest();
//				}
//			});
//			// 시간지나고 상태를 바꿔서 테스트.
//			it('should run with error', function (nextTest) {
//				moduleManager.removeAll();
//				moduleManager.start(modulePath)
//				moduleLoader.loadByModulePathOfPackage(done, modulePathOfPackage);
//				setTimeout(function() {
//					moduleManager.ready(modulePath2)
//					moduleManager.ready(modulePath3)
//				},100);
//				setTimeout(function() {
//					moduleManager.error(modulePath)
//				},200);
//				function done(currentStatus) {
//					expect(moduleManager.getCurrentStatus().status).to.equal('error');
//					nextTest();
//				}
//			});
//		})

/////////////////////////   타임아웃설정하기. 쓸만함.
//	var firstStartTime = null;
//	function isTimeOut(endTime) {
//		if(!firstStartTime) firstStartTime = endTime;
//		if(firstStartTime && endTime) {
//			var diffMillisecond = Math.abs((endTime - firstStartTime) / 1000)
////			console.log('diffMillisecond : ', diffMillisecond);
//			if(diffMillisecond > 1.8) {
//				firstStartTime = null;
//				return true;
//			}
//		}
//		
//		return false;
//	}
