
(function(define, angular) {
	
	
	define([ 
			// outer dependencies	       
	         'uiRouter'
	       , 'ngStorage'
			// user modules	       
	       , 'common/common'
	       , 'module/nav/nav'
	       , 'module/blogBoard/blogBoard'
	       // services
	       , 'dao/userDAO'
	       , 'dao/authDAO'
	       , 'dao/categoryDAO'
	       
	       , 'storage/storage'
  	       // 	controller	       
	       , 'controller/AppController'
	       , 'controller/UserController'
	       , 'controller/AdminController'
	       // config setup & after run
	       , 'setupState'
	       , 'setupHandler'
	       , 'setupLog'
	],
	function(
			// outer modules
			  noUse
			, noUse2
			// user modules
			, common
			, nav
			, blogBoard
			// services & controller
			, userDAO
			, authDAO
			, categoryDAO
			
			, storage
			
			, AppController
			, UserController
			, AdminController
			// config setup & after run 
			, setupState
			, setupHandler
			, setupLog
			) {
		
		var moduleName =  'app'
		  , modules    =   [ 
		                     'ui.router'
		                   , 'ngStorage'
		                   , common
		                   , nav
		                   , blogBoard
		                   ]; 
		angular.module(		moduleName				  		, modules)
			   .constant(  'ANGULAR_ENV' 					, 'log')  //log활동
		
			   .service(	moduleName+'.userDAO' 		, userDAO)
			   .service(	moduleName+'.authDAO' 		, authDAO)
			   .service(	moduleName+'.categoryDAO' 	, categoryDAO)
			   
			   .factory(	moduleName+'.storage'	  		, storage)
			   
			   .controller(	moduleName+'.AppController'		, AppController)
			   .controller(	moduleName+'.UserController'	, UserController)
			   .controller(	moduleName+'.AdminController'	, AdminController)
			   
			   .config(		setupState)
			   .config(		setupLog.config)
			   
			   .run(		setupHandler)		
			   .run(		setupLog.run)
			   .run([ 	'$rootScope', '$state' 
			   ,function($rootScope ,  $state ) {
//				   $state.go('app.blogBoard.list')
				}])
			
		
		return moduleName;
	});
})(define, angular)