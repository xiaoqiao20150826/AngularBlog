/**
 * 
 */
(function(define, angular){
	define([
	          'module/blogBoard/controller/ListController'
	        , 'module/blogBoard/service/blogBoardService'
	        , 'module/blogBoard/setupState' 
	        ]
	,function( ListController
			 , blogBoardService
			 , setupState
			 ){
		
		var moduleName = 'app.blogBoard'
		  , dependencies = [];
		
		angular.module(moduleName, dependencies)
			   .controller(	moduleName+'.ListController', ListController)
			   .service(	moduleName+'.blogBoardService', blogBoardService)
			   .config(		setupState)
		
			
		return moduleName
	})
})(define, angular)