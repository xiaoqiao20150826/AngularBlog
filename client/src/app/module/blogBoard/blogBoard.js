/**
 * 
 */
(function(define, angular){
	define([
	          'module/blogBoard/controller/ListController'
	        , 'module/blogBoard/controller/DetailController'
	        , 'module/blogBoard/controller/UpsertController'
	        , 'module/blogBoard/controller/EditorController'
	        
	        , 'module/blogBoard/controller/AnswerController'
	        
	        , 'module/blogBoard/dao/blogBoardDAO'
	        , 'module/blogBoard/dao/answerDAO'
	        
	        , 'module/blogBoard/setupState' 
	        ]
	,function( ListController
			 , DetailController
			 , UpsertController
			 , EditorController
			 
			 , AnswerController
			 
			 , blogBoardDAO
			 , answerDAO
			 
			 , setupState
			 ){
		
		var moduleName = 'app.blogBoard'
		  , dependencies = [];
		
		angular.module(moduleName, dependencies)
			   .controller(	moduleName+'.ListController', ListController)
			   .controller(	moduleName+'.DetailController', DetailController)
			   .controller(	moduleName+'.UpsertController', UpsertController)
			   .controller(	moduleName+'.EditorController', EditorController)

			   .controller(	moduleName+'.AnswerController', AnswerController)
			   
			   .service(	moduleName+'.blogBoardDAO', blogBoardDAO)
			   .service(	moduleName+'.answerDAO', answerDAO)
			   
			   .config(		setupState)
		
			
		return moduleName
	})
})(define, angular)