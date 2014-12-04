/**
 * 
 */
(function(define, angular){
	define([
	          'module/blogBoard/controller/ListController'
	        , 'module/blogBoard/controller/DetailController'
	        , 'module/blogBoard/controller/UpsertController'
	        , 'module/blogBoard/controller/EditorController'
	        
	        , 'module/blogBoard/dao/blogBoardDAO'
	        , 'module/blogBoard/setupState' 
	        ]
	,function( ListController
			 , DetailController
			 , UpsertController
			 , EditorController
			 
			 , blogBoardDAO
			 , setupState
			 ){
		
		var moduleName = 'app.blogBoard'
		  , dependencies = [];
		
		angular.module(moduleName, dependencies)
			   .controller(	moduleName+'.ListController', ListController)
			   .controller(	moduleName+'.DetailController', DetailController)
			   .controller(	moduleName+'.UpsertController', UpsertController)
			   .controller(	moduleName+'.EditorController', EditorController)
			   
			   .service(	moduleName+'.blogBoardDAO', blogBoardDAO)
			   .config(		setupState)
		
			
		return moduleName
	})
})(define, angular)