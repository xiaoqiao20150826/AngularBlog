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
		// 전역 이름
		$rootScope._  = _
		$rootScope.U  = U
		
		$rootScope.currentUser 	      = currentUser
		$rootScope.rootOfCategory     = rootOfCategory
		$rootScope.categoryTree		  = new Tree(rootOfCategory, 'categories', 'id')		
		// app로접근.
		

		// login view modal
		$rootScope.showLoginView = authDAO.showLoginView
		$rootScope.resetCategory = function() {
			return categoryDAO.getRootOfCategory()
					   		  .then(function(rootOfCategory) {
					   			  	$rootScope.rootOfCategory = rootOfCategory
					   		  })
		}
//		this.loginUser = loginUser
	}
	
})(define, _)