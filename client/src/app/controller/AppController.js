/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$rootScope'
		        , 'common.util'
		        , 'app.authDAO'
		        , 'currentUser'
		        , 'rootOfCategory'
		        , AppController
		        ];
	})
	
	//
	function AppController($rootScope, U, authDAO, currentUser, rootOfCategory) {
		// 전역 이름
		$rootScope._  = _
		$rootScope.U  = U
		
		$rootScope.currentUser = currentUser
		$rootScope.rootOfCategory = rootOfCategory
		
		// app로접근.
		

		// login view modal
		$rootScope.showLoginView = authDAO.showLoginView
//		this.loginUser = loginUser
	}
	
})(define, _)