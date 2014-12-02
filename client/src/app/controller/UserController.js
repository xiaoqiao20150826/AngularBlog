/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope', '$state', 'common.util', 'app.userDAO', UserController];
	})
	
	function UserController($scope, $state, U, userDAO) {
		// 데이터
		
		//다른 곳 영향 안줄려고. 어차피 (리다이렉트로) 새로 바꿀꺼지만.
		$scope.currentUser = _.clone($scope.currentUser)  
		
		
		// 함수
		this.update = function (e) {
			userDAO.update($scope.currentUser)
					   .then(function (result) {
						   if(result.isFail) U.notifyFail(result);
						   else alert('update success')
						   
						   return U.redirect('app.user.detail')
					   })
					   
		    return e.preventDefault();
		}
	}
	
})(define, _)