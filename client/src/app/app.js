
(function(define, angular) {
	
	
	define([ 
	         'controller/AppController'
	       , 'service/UserService'
	       , 'storage/Storage'
	       , 'common/common'
	       
	       , 'module/nav/nav'
	       , 'module/blogBoard/blogBoard'
	       
	       , 'uiRouter'
	       , 'ngStorage'
	],
	function( AppController
			, UserService
			, Storage
			, common
			
			, nav
			, blogBoard) {
		
		var moduleName = 'app'
		  , dependencies = [ 
		                     'ui.router'
		                   , 'ngStorage'
		                   , common
		                   , nav
		                   , blogBoard
		                   ]; //modules
		
		angular.module(		moduleName, dependencies)
			   .service(	'userService', UserService)
			   .factory(	'storage', Storage)
			   .controller(	'AppController', AppController)
			   
			   .config([	'$stateProvider', '$urlRouterProvider',
			    function (   $stateProvider ,  $urlRouterProvider) {
				   $urlRouterProvider
				     .when('/home', '/')
				     .otherwise('/')
				   var __rootUrl = '/resource/src/app/'; 
				   $stateProvider
//				     .state('app', { //root
//				       url   : ''
//				     , templateUrl : __rootUrl + 'view/index.html'	   
//				     , views : {
//				        		  'top' 		: {templateUrl : __rootUrl + 'module/nav/nav.html'}
//								, 'center' 		: {templateUrl : __rootUrl + 'module/blogBoard/view/list.html'}
//								, 'side' 		: {templateUrl : __rootUrl + 'view/part/login.html'}
//								, 'footer' 		: {templateUrl : __rootUrl + 'view/part/login.html'}
//							    , 'part' 		: {templateUrl : __rootUrl + 'view/part/login.html'}
//				       }
//				     })
			   }])
			   .config(['$injector', function ( $injector) {

			   }])
			   .run([ 	'$rootScope', '$state' 
			   ,function($rootScope ,  $state ) {
				   // 이벤트 리스너 등록.
//				   var obj = { a : function (p) { return p + p} }
//				   
//				   logger.decorate(obj)
//				   		 .inject('a', function (name) {
//				   			 console.log('value',name)
//				   		 })
//				   		 
//				   console.log(obj.a(5))
				}])
			
		
		return moduleName;
	});
})(define, angular)