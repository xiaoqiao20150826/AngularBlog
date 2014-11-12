/***
 *  TODO: 컨트롤러에 대해서 안되는문제.
 */

define(['app'], function (app) {
	describe('inspectLogger', function() {
		var $rootScope, userService, inspectorLogger
		
		beforeEach(function() {
			angular.mock.module(app)
			
			angular.mock.inject(function ($injector) {
				inspectorLogger = $injector.get('inspectLogger');
				$rootScope = $injector.get('$rootScope');
				userService = $injector.get('userService');
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
//		it('should get wrapped message ', function () {
//			
//			var rootLogger  = inspectorLogger.decorate('$rootScope')
//								
//			rootLogger.inspect('$broadcast', function () {
//								  this.log(arguments, 'b1')
//					  })
//					  .inspect('$emit', function () {
//								  this.log4arg(arguments, 'emit1')
//					  })
//			
////			var decService = logger.getDecoratedService(objName)
//			$rootScope.$broadcast('c',{broadcast:1})
//			$rootScope.$on('a',function () {})
//			$rootScope.$on('b',function () {})
//			$rootScope.$emit('a',{emit:1})
//			$rootScope.$emit('b',{emit:3})
//			$rootScope.$emit('c',{emit:5})
//		})
		
 	})
 	describe('inspectLoggerProvide', function () {
		var $rootScope, userService, inspectorLogger
		
		beforeEach(function() {
			var serviceInfoes =  {
					 				'$rootScope' : ['$emit+', '$broadcast']
								 }
			angular.module('configHookModule', [])
				   .config(['inspectLoggerProvider', function (inspectLoggerProvider) {
					   inspectLoggerProvider.setServiceInfoes(serviceInfoes)
				   }])
			angular.mock.module(app, 'configHookModule')
			
			angular.mock.inject(function ($injector) {
				inspectorLogger = $injector.get('inspectLogger');
				$rootScope = $injector.get('$rootScope');
				userService = $injector.get('userService');
			})
		})
//		it('should hook fn', function () {
//			$rootScope.$broadcast('c',{broadcast:1})
//			$rootScope.$on('a',function () {})
//			$rootScope.$on('b',function () {})
//			$rootScope.$emit('a',{emit:1})
//			$rootScope.$emit('b',{emit:3})
//			$rootScope.$emit('c',{emit:5})
//			$rootScope.$broadcast('ee','parms')
//		})
 	})
})