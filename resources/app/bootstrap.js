/**
 * 
 */

(function($$c, define, angular) {
	//nodeblog setup & run.
	
	var M = $$c.modules;
	
	define([
	         M.app.name
	],
	function () {
		angular.bootstrap( document.getElementsByTagName("html")[0], [ M.app.name ]);
		
	})
})($$c, define, angular)