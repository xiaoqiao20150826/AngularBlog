/**
 * 
 */

(function(define) {
	
	define([], function() {
		return ['$scope', CommonController];
	})
	
	function CommonController($scope) {
		
		console.log('hi commonctrl')
	}
	
})(define)