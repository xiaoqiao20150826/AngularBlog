/**
 * 
 */

(function(define, angular){
	define(['module/nav/NavController'], function(NavController) {
		var moduleName = 'app.nav'
		  , dependencies = [];
		
			angular.module(moduleName, dependencies)
				   .controller('nav.NavController', NavController)
		
	    console.log('lazyload nav')			
		return moduleName
	})
})(define, angular)