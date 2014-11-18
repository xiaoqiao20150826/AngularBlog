/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope', 'common.util', 'loginUser','app.storage', AppController];
	})
	// 이게 루트스코프일걸?
	function AppController($scope, util, loginUser, storage) {
		// 전역 이름
		$scope._  = _
		$scope.U  = util
		$scope.loginUser = loginUser
		// app로접근.
//		this.loginUser = loginUser
	}
	
})(define, _)