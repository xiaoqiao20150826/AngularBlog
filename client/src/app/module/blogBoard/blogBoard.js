/**
 * 
 */
(function(define, angular){
	define(['module/blogBoard/BlogBoardController'], function(BlogBoardController) {
		var moduleName = 'app.blogBoard'
		  , dependencies = [];
		
			angular.module(moduleName, dependencies)
				   .controller('BlogBoardController', BlogBoardController)
				   .config([	'$stateProvider', '$urlRouterProvider',
				    function (   $stateProvider ,  $urlRouterProvider) {
						   var __rootUrl = '/resource/src/app/'; 
						   $stateProvider
						     .state('app.blogBoard', { 
						       url   : ''
						     , abstract : true
						     , views : {
						    	 'center@' : {
						    		 templateUrl : __rootUrl + 'module/blogBoard/view/list.html'
						    	   , controller  : ['$scope',function() {
						    		   console.log('cff')
						    	   }]
						    	 }
//						     ,  'tab@app' : {templateUrl : __rootUrl + 'module/blogBoard/view/tab.html'}
						       }
						     })
						     .state('app.blogBoard.list', { 
						    	 url   : '/blog'
						      ,  views  : {
						    	  'tab' : {templateUrl : __rootUrl + 'module/blogBoard/view/tab.html'}
						      }
						     })
				   	}])
		
			
		return moduleName
	})
})(define, angular)