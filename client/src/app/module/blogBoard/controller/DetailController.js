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
		$scope.trustAsHtml = $sce.trustAsHtml
		
		// data 관련은 이쪽에.. 바로사용할수있도록.
		var $root 				= $scope.$root
		$scope.post 			= detailData.post
		
		
		//초기화 후에 answer상태로 이동(뷰만 로딩함).
		$state.go('.answer', $stateParams)
		
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
			var isYes = confirm('Do you realy want to delete?')
			if(!isYes) return;
			
			blogBoardDAO.deletePost(writerId, postNum)
						.then(function(message) {
							alert(message)
							return $state.transitionTo('app.blogBoard.list', null, { reload: true});								 
						})
		}
		
	}
	
	
	
})(define)