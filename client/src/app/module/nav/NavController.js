/**
 * 
 */

(function(define) {
	
	define([], function() {
		return ['$scope','$state', NavController];
	})
	
	function NavController($scope, $state) {
		
		$scope.searcher = ''
		
		//
		this.search = function (searcher) {
			$state.go('app.blogBoard.list', {
											 sorter    : ""
										   , pageNum   : 1
										   , categoryId: ""
										   , searcher  : searcher 
										   })
										   
			$scope.searcher = ''
		}
	}
	
})(define)