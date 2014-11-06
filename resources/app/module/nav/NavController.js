/**
 * 
 */

(function(define) {
	
	define([], function() {
		return ['$scope','userService', NavController];
	})
	
	function NavController($scope, userService) {
		$scope.aa = userService.aa	
		console.log('hi navctrl')
	}
	
})(define)