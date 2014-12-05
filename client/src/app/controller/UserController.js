/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope', '$state','$window', 'common.util', 'app.userDAO', UserController];
	})
	
	function UserController($scope, $state, $window, U, userDAO) {
		// 데이터
		
		//다른 곳 영향 안줄려고. 어차피 (리다이렉트로) 새로 바꿀꺼지만.\
		var $root = $scope.$root
		$scope.currentUser = _.clone($root.currentUser)  
		
		// 함수
		this.update = function (e) {
			userDAO.update($scope.currentUser)
					   .then(function (user) {
						   alert('update success')
						   $root.currentUser = user
						   $state.go('app.user.detail')
					   })
					   
		    return e.preventDefault();
		}
		this.delete = function (userId) {
			var isYes = confirm('Do you realy want to leave?')
			if(!isYes) return;
			
			userDAO.delete(userId)
			.then(function (message) {
				alert(message)
				$window.location.reload('/')
			})
		}
	}
	
})(define, _)