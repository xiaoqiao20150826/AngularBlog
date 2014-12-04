/**
 *   post 이 있으면 update
 *   없으면 insert 
 */
(function(define, require, _) {
	
	define([], function() {
		return [  '$scope'
		        , '$state'  
		        , 'post'
		        , 'common.util'  
		        , 'app.blogBoard.blogBoardDAO'
		        , 'app.categoryDAO'
		        , UpsertController];
	})
	
	function UpsertController($scope, $state, post, U, blogBoardDAO, categoryDAO) {
		console.log('upsertControlelr')
		var $root = $scope.$root
		// post르 insert/update 맞게 초기화
		
		
		var isUpdate = U.exist(post)
		if(isUpdate) {
			post.originCategoryId    = post.categoryId
		} else {
			post 			= { fileInfoes : []}
		}
		
		$scope.rootOfCategory 	  = $root.rootOfCategory
		$scope.post 			  = post

		// TODO : 이게 좀 그지같지만.. 내가 만든 카테고리 셀렉터가..어쩔수가..ㅡㅡ
		// e다른방법으로.. jquery를 사용할수도있겠네...ㅠㅠ
		$scope.selectedCategoryId = ''
		$scope.selectedInitCategory = function($selectorScope) {
			setTimeout(function(){
				$scope.selectedCategoryId = post.categoryId || $root.rootOfCategory.id
				$selectorScope.$apply()
			},1000)
		}
		
		// this.. as upsert
		this.upsertPost = function (post) {
			post.userId     = $root.currentUser._id
			post.categoryId = $scope.selectedCategoryId
			post.content    = $scope.$$editor.getContentText();  // EditorController.에서 할당
			if(U.notExist(post.title)) return alert('title should not empty')  
			if(U.notExist(post.content)) return alert('content should not empty')
			
			if(isUpdate) {
				blogBoardDAO.updatePost(post)
							.then(function(status) {
								_resetCategoryAndGoDetail(post.num, post.title)
							})				
			} else {
				blogBoardDAO.insertPost(post)
						  .then(function(insertedPost) {
							  _resetCategoryAndGoDetail(insertedPost.num, insertedPost.title)
						  })
			}
			
			function _resetCategoryAndGoDetail(postNum, title) {
				var param = {}
				param.postNum =	postNum
				param.title   = U.title4web(title)
				$root.resetCategory()
					 .then(function() {
						 $state.go("app.blogBoard.detailEx", param) 
					 })
			}			
		} 
		
	}
	
})(define, require, _)