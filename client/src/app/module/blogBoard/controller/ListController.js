/**
 * 
 */

(function(define) {
	
	define([], function() {
		return [  '$scope'
		        , '$stateParams'  
		        , '$window'  
		        , 'app.blogBoard.blogBoardService'
		        , 'listData'
		        , ListController];
	})
	
	function ListController($scope, $stateParams , $window, blogBoardService, listData) {
		// data 관련은 이쪽에.. 바로사용할수있도록.
		$scope.posts 	= listData.posts
		$scope.pager 	= listData.pager
		$scope.sorters		= ['newest', 'oldest', 'view', 'vote', 'answer']
		
		$scope.currentSorter = $stateParams.sorter || 'newest';
		$scope.currentPageNum = $stateParams.pageNum || 1;
		
		// --- 유틸 관련은 이쪽에
		var listCtrl 	= this
		var Date  	 	= $window.Date
		
		// 유틸
		listCtrl.date = function (dateStr) {
			return new Date(dateStr).toLocaleString()
		}
		listCtrl.title4web = function (title) {
			return title.trim().replace(/\s+/g, '-');
		}
	}
	
	
	
})(define)