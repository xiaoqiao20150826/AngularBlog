/**
 * 
 */

(function(define) {
	
	define([], function() {
		return ['$scope','userService', AppController];
	})
	
	function AppController($scope, userService) {
		//setUpInitData
		_setupInitData(this, userService)
	}
	
	
	function _setupInitData(appCtrl, userService) {
		_setUser(appCtrl, userService)
		
	}
	function _setUser(appCtrl, userService) {
		userService.getLoginUser()
				   .then(function(user) {
						appCtrl.user = user;
					})
	}
	
})(define)