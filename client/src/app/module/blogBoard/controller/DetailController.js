/**
 * 
 */

(function(define) {
	
	define([], function() {
		return [  '$scope'
		        , '$stateParams'  
		        , '$window'  
		        , 'app.blogBoard.blogBoardService'
		        , 'detailData'
		        , DetailController];
	})
	
	function DetailController($scope, $stateParams , $window, blogBoardService, detailData) {
		// data 관련은 이쪽에.. 바로사용할수있도록.
		$scope.posts 	= detailData.post
		$scope.pager 	= detailData.pager
		
		$scope.currentSorter = $stateParams.sorter || 'newest';
		$scope.currentPageNum = $stateParams.pageNum || 1;
		
		// --- 유틸 관련은 이쪽에
		var detailCtrl 	= this
		
		// 유틸
	}
	
	
	
})(define)