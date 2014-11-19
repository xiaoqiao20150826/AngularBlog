/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope', '$state', 'common.util', 'app.userService', UserController];
	})
	
	function UserController($scope, $state, util , userService) {
		// 데이터
		
		//다른 곳 영향 안줄려고. 어차피 (리다이렉트로) 새로 바꿀꺼지만.
		$scope.currentUser = _.clone($scope.currentUser)  
		
		// 함수
		this.update = function (e) {
			console.log('before', $scope.currentUser)
			userService.update($scope.currentUser)
					   .then(function (result) {
						   if(result.isSuccess) alert('update success')
						   else alert('update success')
						   
						   $state.go('app.user.detail')
					   })
					   
		    return e.preventDefault();
		}
	}
	
})(define, _)