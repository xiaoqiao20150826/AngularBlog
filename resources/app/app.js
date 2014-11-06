
(function(define, angular) {
	
	define([ 
	         'state/StateManager'
	       , 'controller/CommonController'
	       , 'service/UserService'
	       , 'module/nav/nav'
	       
	       , 'uiRouter'
	],
	function(StateManager, CommonController, UserService, nav) {
		var moduleName = 'app'
		  , dependencies = [ 'ui.router' , nav]
		
		angular.module(moduleName, dependencies)
			   .config(StateManager)
			   .service('userService', UserService)
			   .controller('CommonController', CommonController)
			   .run(function(){})
			
		
		return moduleName;
	});
})(define, angular)