/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope', '$state','$window', 'common.util', 'app.userDAO', 'user', UserController];
	})
	
	function UserController($scope, $state, $window, U, userDAO, user) {
		// 데이터
		
		//다른 곳 영향 안줄려고. 어차피 (리다이렉트로) 새로 바꿀꺼지만.\
		var $root = $scope.$root
		$scope.currentUser = _.clone($root.currentUser)  
		$scope.user = user //읽기용  
		
		// 함수
		this.update = function (e) {
			userDAO.update($scope.currentUser)
					   .then(function (updatedUser) {
						   alert('update success')
						   $root.currentUser = updatedUser
						   $state.go('app.user.detail',{userId:updatedUser._id})
					   })
		}
		this.delete = function (userId) {
			var isYes = confirm('Do you realy want to leave?')
			if(!isYes) return;
			
			userDAO.delete(userId)
			.then(function (message) {
				alert(message)
				 $state.transitionTo('app.blogBoard.list', null, { reload: true, inherit: false, notify: true });
			})
		}
	}
	
})(define, _)