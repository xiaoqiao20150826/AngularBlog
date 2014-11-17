/***
 *  TODO: log 메시지는... 테스트를 어떻게 해야하는 것일까.
 */

define(['app'], function (app) {
	describe('inspectLogger', function() {
		var $rootScope, userService, inspectorLogger
		
		beforeEach(function() {
			angular.mock.module(app)
			
			angular.mock.inject(function ($injector) {
				inspectorLogger = $injector.get('common.inspectLogger');
				$rootScope = $injector.get('$rootScope');
				userService = $injector.get('app.userService');
			})
		})
		it('should get service Ojbect ', function () {
			var objName = '$rootScope'
			var obj = inspectorLogger.getService(objName)
			expect(obj).toEqual($rootScope)
		})
		it('should get decorated service Ojbect ', function () {
			var objName = '$rootScope'
			inspectorLogger.decorate(objName)
			var decService = inspectorLogger.getDecoratedService(objName) //
			expect(decService.obj).toEqual($rootScope)
		})
		it('should run console.log about $emit that param is !c', function () {

//			var argsFilter = function (a,b,c) {
//				if(!(a==='c')) return true;
//			}
//			
//			var rootLogger  = inspectorLogger.decorate('$rootScope')
//			rootLogger.inspect('$emit+', function () {
//						  	this.log(arguments, 'emit')
//					  }, argsFilter)
//			
//			$rootScope.$on('a',function () {})
//			$rootScope.$on('b',function () {})
//			$rootScope.$on('c',function () {})
//			$rootScope.$emit('a',{emit:1})	 //출력
//			$rootScope.$emit('b',{emit:3})	// 출력
//			$rootScope.$emit('c',{emit:5})  // 필터링 되었기에 출력 x
		})
		
 	})
 	describe('inspectLoggerProvide', function () {
		var $rootScope, userService, inspectorLogger
		
		beforeEach(function() {
			var serviceInfoes =  {
								    '$controller'	 : ['service']
					 			  ,	'$rootScope' : {
					 				  				 methodNames : ['$emit+', '$broadcast:before+']
			 									   , filter : function (a){ 
			 										   		return !(a==='c') 
			 										}
			
					 			  	 }
								 }
			angular.module('configHookModule', [])
				   .config(['common.inspectLoggerProvider', function (inspectLoggerProvider) {
					   inspectLoggerProvider.setServiceInfoes(serviceInfoes)
				   }])
			angular.mock.module(app, 'configHookModule')
			
			angular.mock.inject(function ($injector) {
				inspectorLogger = $injector.get('common.inspectLogger');
				$rootScope = $injector.get('$rootScope');
				userService = $injector.get('app.userService');
			})
		})
		it('should run console.log about $broadcast that param is !c', function () {
//			$rootScope.$broadcast('console.log에 이것만 출력되면 됨.','parms')
//			$rootScope.$broadcast('c',{broadcast:1}) // 이건 설정에서 필터링했기에 출력안됨.
		})
 	})
})