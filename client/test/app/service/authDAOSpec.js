/**
 * 
 */

define(['app'], function (app) {
	describe('authDAO', function() {
		var _authDAO 
		var $httpBackend
		var $rootScope
		beforeEach(function() {
			angular.module('configHookModule', []).constant('ANGULAR_ENV', 'test')
			angular.mock.module(app, 'configHookModule')
			
			angular.mock.inject(function ($injector) {
				_authDAO = $injector.get('app.authDAO')
				$httpBackend = $injector.get('$httpBackend')
				$rootScope = $injector.get('$rootScope')
				

			})
		})
		afterEach(function() {
			$httpBackend.flush();
		    $httpBackend.verifyNoOutstandingExpectation();
		    $httpBackend.verifyNoOutstandingRequest();
		});
		
		
		it('#getUser : should get user', function() {
			var loginUserString = JSON.stringify({obj:{name:'login'}})
			
			$httpBackend.whenGET('/json/user/loginUser').respond(loginUserString)
			$httpBackend.whenGET(/[\/].*/).respond(''); //hook..stateprovider때문에. 그리고 우선순위때문에 ㅡㅡ
			
			_authDAO.getLoginUser()
					.then(function(user) {
						expect(user.name).toEqual('login');
					})
					
//			$rootScope.$apply()
		})
	})
})
