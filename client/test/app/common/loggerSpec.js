/**
 * 
 */

define(['app'], function (app) {
	describe('logger', function () {
		var loggerFromProvider, logger
		
		beforeEach(function() {
			angular.module('configHookModule', [])
			   .config(['objectLoggerProvider', function (loggerProvider) {
				   loggerFromProvider = loggerProvider.$get()
			   }])
			angular.mock.module(app, 'configHookModule')
		
			angular.mock.inject(function ($injector) {
				logger = $injector.get('objectLogger');
			})
		})
		// 아직. 뭐 없다.
		it('should equal loggerFromProvider and logger', function () {
			expect(logger).toEqual(loggerFromProvider)
			
		})
		it('should args To JsonList', function () {
			var arg1 = [1, 2, {a:1, b:'b'} ,'c', function(){}]
			var arg2 = 3333
			var arg3 = 'efef'
			var arg4 = {a:1, b:'b'}
			var arg5 = function(){return ;}
			assert(arg1,arg2,arg3,arg4,arg5)
			function assert() {
				var list = logger.argsToJsonList(arguments)
				expect(list.length).toEqual(2)
			}
		})
//		it('log test', function () {
//				logger.log('l','2')
//				logger.info('i','3')
//		})
	})
})