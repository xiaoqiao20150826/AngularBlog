/**
 *   # Why
 *    - angular의 동작을 디버깅으로 확인을 한다. 
 *    그러나 비동기, 이벤트, 프레임워크의 이해 등으로 인해 디버깅을 하더라도 동작을 확인하기 어렵다.
 *    app가 동작하면서 비동기 동작, 이벤트 등이 발생했을 경우 "어떤 정보"와 "흐름"을 가지는지 확인하고 싶다.
 *    = $provide.decorator를 이용하여 로그를 남기면 내가 원하는 동작을 수행하지만,
 *      provider의 설정을 이용하여 더 간편하게 정보를 얻고 싶다.
 *    
 *   # What    
 *    - 앙귤러 서비스의 동작을 장식하여 원하는 정보를 "(콘솔)로그"로 알려준다.
 *    - module.config시점에서 provider의 설정을 이용하여 "미리 설정하여" 사용 한다.
 *    - 유동적으로 정보를 확인. 디버깅을 도와주는 용도라고 생각하면 된다.
 *   
 *   # How
 *    1) 일반적인 것. module.config함수의 *provider 설정을 이용.
 *      - 함수이름의 마지막의 '+'문자는 log 사용시 log4arg 를 이용한다는 표시.
 *      - [...method..] or { methodNames : [], filter }
 *    	inspectServiceInfoes = {
 *    						 	'$rootScope' : {
 *    											 methodNames : ['$emit+', '$broadcast']
 *    										   , filter      : filterFn
 *    										   }  
 *                            , 'other...' : [...method...]
 *    			 			  }
 *      inspectInspectLoggerProvider.setInspectServiceInfoes(inspectServiceInfoes);
 *      
 *     - 결과
 *       ; arguments 기본 설정
 *      시간 : $rootScope#함수 : args(a,b,c...) // 콘솔에서 클릭시 자세한값 보도록.
 *      
 *       ; arguments json   // raw type은 그냥 둠.
 *      시간 : $rootScope#함수 : args(a,b,c)
 *           arg1) a : jsonString......
 *           arg3) c : jsonString.......       	
 *   
 *    2) 특별한 것. // module.run 시점에 직접할것.
 *       inspectLogger.decorate('$rootScope') 		// object을 전달해도됨.
 *       			  .inspect('함수', function () {
 *        					// arg에 대해 원하는 동작
 *        					inspectLogger.log() // 1)에서 설정된 로그를 사용한다.
 *        					inspectLogger.log4args() // 1)의 arg가 json설정.
 *        
 *        					// 여기서 해당 인스턴스외의 값을 확인할수도있지뭐.
 *        					object.value....
 *       			  })
 *   
 */
(function (define, _) {
	// --------   1. makeInspectLoggerProvider ( setup config for logger)
	define([], function () {
		return [  '$provide' 
		        , 'common.ObjectDecoratorProvider'
		        , 'common.objectLoggerProvider'
		        , makeInspectLoggerProvider]
	})

	function makeInspectLoggerProvider($provide, odp, olp) {
		// TODO: 이렇게 가져와야할까. 다른의존성이없기는한데.
		var ObjectDecorator = odp.$get() 
		  , objectLogger = olp.$get();
		var inspectLogger = makeInspectLogger(objectLogger, ObjectDecorator)
		
		//---------- 1. InspectLoggerProvider ( public api for setup config)
		var serviceInfoes  = {};		
		
		// 서비스 정보 받고... 로깅설정까지.
		this.setServiceInfoes = function (_serviceInfoes) {
			var _serviceInfoes = _.extend(serviceInfoes, _serviceInfoes) // config에 추가 복사
			_initInspectServices(_serviceInfoes, inspectLogger)
		}
		function _initInspectServices (serviceInfoes, inspectLogger) {
			var serviceNames = _.keys(serviceInfoes)
			
			_.each(serviceNames, function (serviceName) {
				$provide.decorator(serviceName, function ($delegate) {
					
					var mAf 		= _methodNamesAndFilter(serviceInfoes[serviceName])
					  , methodNames = mAf.methodNames
					  , filter  	= mAf.filter;
					
					_.each(methodNames, function(methodName) {
						
						inspectLogger.decorate($delegate, serviceName)
									 .inspect(methodName, function(/*args*/) {
											 this.log(arguments)									 
									 }, filter);	
					})

					return $delegate;
				})
				
			})
		}
		function _methodNamesAndFilter(mAf) {
			var result = {}
			if(!_.isObject(mAf)) return console.error(mAf + 'is wrong config');
			
			if(_.isArray(mAf)) { 
				result.methodNames = mAf
				result.filter = null
			} else {
				result.methodNames = mAf.methodNames
				result.filter = mAf.filter
			}
			return result;
		} 
		
		this.$get = ['$injector'
		, function (  $injector ) {
			
			
			inspectLogger.set$injector($injector) 
			return inspectLogger;
		}]
		// ---------  2. makeLogger
		function makeInspectLogger($log , ObjectDecorator) {
			
			var decoratedServiceMap = {}
			
			var objCount = 0 //앙귤러 모듈이 아닐경우 익명 함수 이름.
			  , ANNOYMOUS_OBJ = 'annoymousObj';
			///
			var logger = { }
			logger.decorate = function(obj, objName) {
				var name = objName || ANNOYMOUS_OBJ + (++objCount)
				if(_.isString(obj)) {
					name = obj;
					obj = logger.getService(obj)
				}
				if(_.isNull(obj) || _.isEmpty(obj)) return console.error( name + ' is not exist object');
				
				var decoratedObj = this.getDecoratedService(name);
				if(_.isEmpty(decoratedObj)) {
					decoratedObj = new ObjectDecorator(obj)
					logger.setDecoratedService(name, decoratedObj)
				}
				
				return makeDecoratedLogger(name, decoratedObj, $log);
			};
			function makeDecoratedLogger(objName, decoratedObj, $log) {
				var decoratedLogger = {}
				decoratedLogger.log = $log.log
				
				//method:before, method:after, method:before+, method:before+
				decoratedLogger.inspect = function (methodName , inspectFn, filter) {
					var mAnda = logger._divideNameAndIsArg(methodName)
					  , methodName 		  = mAnda.methodName
					  , isArg			  = mAnda.isArg;
					
					var logFn = isArg ? $log.log4arg : $log.log  
					var injectLogger = {
					    				 log : hookMessage(objName, methodName, logFn)
					   				   }
					decoratedObj.decorate( methodName, function () {
						return inspectFn.apply(injectLogger, arguments)
					}, filter)
			        return this;
				}
				
				
				return decoratedLogger
			}
			function hookMessage(objName, methodName, logFn) {
				return function () {
					var args    = [].slice.call(arguments);
		            args.unshift(objName+'#'+methodName )
					return logFn.apply(null, args)
				}
			}
			
			logger.set$injector = function (_$injector) {this.$injector = _$injector}
			logger.getService = function (moduleName) {
				if(this.$injector.has(moduleName))  //이건 프로바이더..도 참이라하는데. get에서 에러날수있어.
					return this.$injector.get(moduleName)
				else
					return null;
			}
			logger.setDecoratedService = function (name, decObj) {
				decoratedServiceMap[name] = decObj //일단.
			}
			logger.getDecoratedService = function (name) { return decoratedServiceMap[name]}
			logger.getDecoratedServiceMap = function () { return decoratedServiceMap}
			
			// methodName의 마지막 문자가 +인지를 판단하여 isArg에 t/f 값을 할당.
			logger._divideNameAndIsArg = function (methodNameAndIsArg) {
				
				var lastIndex = methodNameAndIsArg.length-1
				
				var result = {}
				if(methodNameAndIsArg.charAt(lastIndex) === '+') { 
					result.methodName = methodNameAndIsArg.slice(0, lastIndex)
					result.isArg = true
				} else {
					result.methodName = methodNameAndIsArg;
					result.isArg = false;
				}
					
				return result
			}
			
			//////////////////////////////////////////////////////////
			return logger;
		}
		
		
		
		
	}
	////
})(define, _)