/**
 * 
 */

(function(define) {
	
	define([], function() {
		return [  '$scope'
		        , '$stateParams'
		        , InsertController];
	})
	
	function InsertController($scope, $stateParams) {
		
		// data 관련은 이쪽에.. 바로사용할수있도록.
//		$scope.post 			= detailData.post
//		$scope.answers			= detailData.post.answers
//		$scope.currentPostNum 	= $stateParams.postNum || null; //이게 리스트..로갈수있어야함.
		// 유틸
	}
	
	
	
})(define)