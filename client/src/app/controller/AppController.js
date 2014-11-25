/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$rootScope'
		        , 'common.util'
		        , 'app.authService'
		        , 'currentUser'
		        , 'rootOfCategory'
		        , AppController
		        ];
	})
	
	function AppController($rootScope, util, authService, currentUser, rootOfCategory) {
		// 전역 이름
		$rootScope._  = _
		$rootScope.U  = util
		
		$rootScope.currentUser = currentUser
		$rootScope.rootOfCategory = rootOfCategory
		
		// app로접근.
		

		// login view modal
		$rootScope.showLoginView = authService.showLoginView
//		this.loginUser = loginUser
	}
	
})(define, _)