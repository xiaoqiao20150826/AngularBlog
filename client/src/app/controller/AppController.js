/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$rootScope'
		        , 'common.util'
		        , 'common.Tree'
		        , 'app.authDAO'
		        , 'app.categoryDAO'
		        , 'currentUser'
		        , 'rootOfCategory'
		        , AppController
		        ];
	})
	
	//
	function AppController($rootScope, U, Tree, authDAO, categoryDAO , currentUser, rootOfCategory) {
		// ------ 전역 데이터
		// 유틸
		$rootScope._  = _
		$rootScope.U  = U
		
		// 객체
		$rootScope.currentUser 	      = currentUser
		
		$rootScope.rootOfCategory     = rootOfCategory
		$rootScope.categoryTree		  = new Tree(rootOfCategory, 'categories', 'id')
		
		$rootScope.selectedPostNum    = null //글 선택시...
		$rootScope.selectedCategoryId = null //카테고리 선택시.

		
		//------ 전역 함수
		// login view modal
		$rootScope.showLoginView = authDAO.showLoginView
		$rootScope.resetCategory = function() {
			return categoryDAO.getRootOfCategory()
					   		  .then(function(rootOfCategory) {
					   			  	$rootScope.rootOfCategory = rootOfCategory
					   		  })
		}
		
//		window.$root = $rootScope
	}
	
})(define, _)