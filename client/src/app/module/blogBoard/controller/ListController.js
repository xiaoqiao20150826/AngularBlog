/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [  '$scope'
		        , '$stateParams'  
		        , '$window'
		        , 'common.util'
		        , 'app.blogBoard.blogBoardDAO'
		        , 'listData'
		        , ListController];
	})
	
	function ListController($scope, $stateParams , $window, U, blogBoardDAO, listData) {
		
		// data 관련은 이쪽에.. 바로사용할수있도록.
		var $root 	    = $scope.$root
		$root.selectedCategoryId = $stateParams.categoryId
		
		$scope.posts 	= listData.posts
		$scope.pager 	= listData.pager
		$scope.sorters		= ['newest', 'oldest', 'view', 'vote', 'answer']
		
		$scope.currentSorter = $stateParams.sorter || 'newest';
		$scope.currentPageNum = $stateParams.pageNum || 1;
		
		
		// --- 유틸 관련은 이쪽에
		var listCtrl 	= this
		var Date  	 	= $window.Date
		
		// 유틸
		var tree = $root.categoryTree
		this.titleByCategoryId = function(categoryId) {
			var routedNodes = tree.route(categoryId)
			
			var aggregateTitle = ''
			for(var i in routedNodes) {
				var routedNode = routedNodes[i]
				  , title      = routedNode.title
				  
				aggregateTitle = aggregateTitle + title;
				
				if(i < routedNodes.length - 1) {
					aggregateTitle = aggregateTitle + ' > '
				}
			}
			return aggregateTitle;
		}
	}
	
	
	
})(define, _)