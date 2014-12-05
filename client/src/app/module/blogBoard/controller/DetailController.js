/**
 * 
 */

(function(define) {
	
	define([], function() {
		return [  '$scope'
		        , '$sce'
		        , '$state'
		        , 'detailData'
		        , 'app.authDAO'
		        , 'app.blogBoard.blogBoardDAO'
		        , '$stateParams'
		        , DetailController];
	})
	
	// sce..?
	function DetailController($scope, $sce, $state, detailData, authDAO, blogBoardDAO, $stateParams) {
		detailData.post.content = $sce.trustAsHtml(detailData.post.content)
		
		// data 관련은 이쪽에.. 바로사용할수있도록.
		var $root 				= $scope.$root
		$scope.post 			= detailData.post
		
		// this.. as detail
		this.increaseVote = function (postNum) {
			blogBoardDAO.increaseVote(postNum)
						.then(function(message) {
							alert(message)
							$scope.post.vote  =  $scope.post.vote + 1;
						})
		}
		// TODO: 보안상 좀위험하지않을까?
		this.delete = function (writerId, postNum) {
			blogBoardDAO.deletePost(writerId, postNum)
						.then(function(message) {
							alert(message)
							return $root.resetCategory()
						})
						.then(function() {
							return $state.go('app.blogBoard.list')								 
						})
		}
		
	}
	
	
	
})(define)