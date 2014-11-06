/**
 * 
 */

(function(define, angular) {
	//nodeblog setup & run.
	
	define([
	        'app'
	],
	function (app, nav) {
		angular.bootstrap( document.getElementsByTagName("html")[0], [ app ]);
	})
	
})(define, angular)