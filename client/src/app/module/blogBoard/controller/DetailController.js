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
		$scope.post 			= detailData.post
		$scope.answers			= detailData.post.answers
		$scope.currentPostNum 	= $stateParams.postNum || null; //이게 리스트..로갈수있어야함. root로저장>?
		
		// this.. as detail
		this.increaseVote = function (postNum) {
			blogBoardDAO.increaseVote(postNum)
						.then(function(status) {
							alert(status)
							console.log(status)
							$scope.post.vote  =  $scope.post.vote + 1;
						})
		}
	}
	
	
	
})(define)