/**
 * 
 */

(function(define, angular){
	define(['module/nav/NavController'], function(NavController) {
		var moduleName = 'app.nav'
		  , dependencies = [];
		
			angular.module(moduleName, dependencies)
				   .controller('NavController', NavController)
		
			
		return moduleName
	})
})(define, angular)