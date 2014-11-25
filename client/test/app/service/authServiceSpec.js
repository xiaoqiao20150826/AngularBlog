/**
 * 
 */

define(['app'], function (app) {
	describe('authService', function() {
		var _authService 
		var $httpBackend
		beforeEach(function() {
			angular.module('configHookModule', []).constant('ANGULAR_ENV', 'test')
			angular.mock.module(app, 'configHookModule')
			
			angular.mock.inject(function ($injector) {
				_authService = $injector.get('app.authService')
				$httpBackend = $injector.get('$httpBackend')
				
				$httpBackend.whenGET(/[\/].*/).respond(200, ''); //hook..stateprovider때문에.

			})
		})
		afterEach(function() {
			$httpBackend.flush();
		    $httpBackend.verifyNoOutstandingExpectation();
		    $httpBackend.verifyNoOutstandingRequest();
		});
		
		
		it('#getUser : should get user', function() {
			var loginUserString = JSON.stringify({name:'login'})
			$httpBackend.expectGET('/json/auth/loginUser').respond(loginUserString)
			_authService.getLoginUser().then(function(user) {
				expect(user.name).toEqual('login');
			});
		})
	})
})
