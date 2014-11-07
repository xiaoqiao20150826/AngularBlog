
(function(define, angular) {
	
	
	
	define([ 
	         'state/StateManager'
	       , 'controller/AppController'
	       , 'service/UserService'
	       , 'storage/Storage'
	       , 'util/Util'
	       
	       , 'module/nav/nav'
	       
	       , 'uiRouter'
	       , 'ngStorage'
	],
	function(StateManager, AppController, UserService, Storage, Util, nav) {
		var moduleName = 'app'
		  , dependencies = [ 
		                     'ui.router'
		                   , 'ngStorage'  
		                   , nav
		                   ]; //modules
		
		angular.module(moduleName, dependencies)
			   .config(StateManager) //setup state
			   .service('userService', UserService)
			   .factory('storage', Storage)
			   .factory('util', Util)
			   .controller('AppController', AppController)
			   .run(function(){})
			
		
		return moduleName;
	});
})(define, angular)