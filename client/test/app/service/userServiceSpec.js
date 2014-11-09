/**
 * 
 */

define(['app'], function (app) {
	describe('userService', function() {
		var _userService, storage; 
		var $httpBackend, $http;
		beforeEach(function() {
			
			angular.mock.module(app)
			angular.mock.inject(function ($injector) {
				storage = $injector.get('storage')
				_userService = $injector.get('userService')
				$httpBackend = $injector.get('$httpBackend')
				$http = $injector.get('$http')
				
				///
				storage.reset();
			})
		})
		afterEach(function() {
		    $httpBackend.verifyNoOutstandingExpectation();
		    $httpBackend.verifyNoOutstandingRequest();
		    storage.reset();
		});
		
		
		it('#getUser : should get user', function() {
			var loginUserString = JSON.stringify({name:'login'})
			$httpBackend.expectGET('/user/loginUser').respond(loginUserString)
			
			_userService.getUser().then(function(user) {
				expect(user.name).toEqual('login');
			});
			$httpBackend.flush();
		})
	})
})
