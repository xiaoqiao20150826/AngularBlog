
(function(define, angular) {
	
	
	define([ 
			// outer dependencies	       
	         'uiRouter'
	       , 'ngStorage'
			// user modules	       
	       , 'common/common'
	       , 'module/nav/nav'
	       , 'module/blogBoard/blogBoard'
	       // services & controller
	       , 'controller/AppController'
	       , 'service/userService'
	       , 'storage/storage'
	       // config setup & after run
	       , 'setupState'
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
			, AppController
			, userService
			, storage
			// config setup & after run 
			, setupState
			, setupLog
			) {
		
		var moduleName = 'app'
		  , modules = [ 
		                     'ui.router'
		                   , 'ngStorage'
		                   , common
		                   , nav
		                   , blogBoard
		                   ]; 
		angular.module(		moduleName				  	, modules)
			   .service(	moduleName+'.userService' 	, userService)
			   .factory(	moduleName+'.storage'	  	, storage)
			   .controller(	moduleName+'.AppController'	, AppController)
			   
			   .config(		setupState)
			   .config(		setupLog.config)
			   .run(		setupLog.run)
			   .run([ 	'$rootScope', '$state' 
			   ,function($rootScope ,  $state ) {
//				   $state.go('app.blogBoard.list')
				}])
			
		
		return moduleName;
	});
})(define, angular)