/**
 * 
 */

define(['app'], function (app) {
	describe('httpFailHandler', function () {
		var httpFailHandler, $q, $rootScope , $httpBackend
		  , res, serverData, user, err
		  
		beforeEach(function() {
			angular.module('configHookModule', []).constant('ANGULAR_ENV', 'test')
			angular.mock.module(app, 'configHookModule')
			
			angular.mock.inject(function ($injector) {
				httpFailHandler   = $injector.get('app.httpFailHandler');
				$q 		   	   = $injector.get('$q');
				$rootScope 	   = $injector.get('$rootScope');
				
				user 	   	   = {name:'user1'}
				err			   = {error: {name:'error obj'}, message:'test error message'}
				serverData     = { isSuccess : true, obj : user  }
				res 	       = {data : serverData }
				
				$httpBackend = $injector.get('$httpBackend')
				$httpBackend.whenGET(/[\/].*/).respond(200, ''); //hook..stateprovider때문에.
			})
		})
		afterEach(function() {
			$httpBackend.flush();
		    $httpBackend.verifyNoOutstandingExpectation();
		    $httpBackend.verifyNoOutstandingRequest();
		});
		it('should get _user in thenFn if success', function () {
			var deferred = $q.defer(); 
			
			httpFailHandler.notifyAndDone(deferred.promise)
						  .then(function (_user) {
							  expect(user).toEqual(_user)
//							  console.log(_user)
						   })
			
			deferred.resolve(res)			   
			$rootScope.$apply()			
		})
		it('should not work thenFn if fail', function () {
			serverData.isSuccess = false
			serverData.obj 		 = err
			window.alert		 = function(){} // hook
			window.console.error = function(){} // hook
			
			var deferred = $q.defer()
			
			httpFailHandler.notifyAndDone(deferred.promise)
						  .then(function (_user) { console.error('this is not work')})
						  .catch(function (_user) { console.error('this is not work')})
						
			deferred.resolve(res)
			$rootScope.$apply()						
		})
		
		//TODO: state..테스트가 왜 제대로 안될까.
		it('should redirect main', inject(function ($state) {
			serverData.isSuccess = false
			serverData.obj 		 = err
			window.alert		 = function(){} // hook
			window.console.error = function(){} // hook
			
			
			var deferred = $q.defer(); 
			console.log($state.current)
			
			httpFailHandler.notifyAndRedirect(deferred.promise)
						   .then(function (_user) {
							   console.info($state.current)
							   console.error('this is not work')
							   })
						   .catch(function (_user) { console.error('this is not work')})
			
			deferred.resolve(res)			   
			$rootScope.$digest()
		}));
			
	})
})