/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$scope'
		        , '$state'
		        , SideController];
	})
	
	function SideController($scope, $state) {
		var $root = $scope.$root
		
		$scope.rootOfCategory = $root.rootOfCategory 
		
	}
	
})(define, _)