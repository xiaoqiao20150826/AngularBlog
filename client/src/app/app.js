
(function(define, angular) {
	
	define([ 
			// outer dependencies	       
	         'ngStorage'
			// user modules	       
	       , 'common/common'
	       // services
	       , 'dao/userDAO'
	       , 'dao/authDAO'
	       , 'dao/categoryDAO'
	
	       , 'storage/storage'
  	       // 	controller	       
	       , 'controller/AppController'
	       , 'controller/UserController'
	       , 'controller/AdminController'
	       , 'controller/CategoryController'
	       , 'controller/SideController'
	       // config setup & after run
	       , 'setupHandler'
	       , 'setupLog'
	],
	function(
			// outer modules
			  noUse
			// user modules
			, common
			// services & controller
			, userDAO
			, authDAO
			, categoryDAO
			
			, storage
			
			, AppController
			, UserController
			, AdminController
			, CategoryController
			, SideController
			// config setup & after run 
			, setupHandler
			, setupLog
			) {
		
		var moduleName =  'app'
		  , modules    =   [ 
		                    'ngStorage'
		                   , common
		                   ]; 
		angular.module(		moduleName				  		, modules)
		
			   .service(	moduleName+'.userDAO' 			, userDAO)
			   .service(	moduleName+'.authDAO' 			, authDAO)
			   .service(	moduleName+'.categoryDAO' 		, categoryDAO)
			   
			   .factory(	moduleName+'.storage'	  		, storage)
			   
			   .controller(	moduleName+'.AppController'		, AppController)
			   .controller(	moduleName+'.UserController'	, UserController)
			   .controller(	moduleName+'.AdminController'	, AdminController)
			   .controller(	moduleName+'.CategoryController', CategoryController)
			   .controller(	moduleName+'.SideController'    , SideController)
			   
			   .constant(  'ANGULAR_LOG' 					, false)  	//log활동
			   .config(		setupLog.config)
			   .run(		setupLog.run)
			   .run(		setupHandler)		 //state, url 핸들러.
			   
		console.log('lazyLoad app')
		return moduleName;
	});
})(define, angular)