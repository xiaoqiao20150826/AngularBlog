/**
 * 
 */
(function(define, angular){
	define([
	          'module/blogBoard/controller/ListController'
	        , 'module/blogBoard/controller/DetailController'
	        , 'module/blogBoard/controller/InsertController'
	        
	        , 'module/blogBoard/service/blogBoardService'
	        , 'module/blogBoard/setupState' 
	        ]
	,function( ListController
			 , DetailController
			 , InsertController
			 
			 , blogBoardService
			 , setupState
			 ){
		
		var moduleName = 'app.blogBoard'
		  , dependencies = [];
		
		angular.module(moduleName, dependencies)
			   .controller(	moduleName+'.ListController', ListController)
			   .controller(	moduleName+'.DetailController', DetailController)
			   .controller(	moduleName+'.InsertController', InsertController)
			   
			   .service(	moduleName+'.blogBoardService', blogBoardService)
			   .config(		setupState)
		
			
		return moduleName
	})
})(define, angular)