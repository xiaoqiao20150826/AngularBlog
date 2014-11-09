/**
 * 
 */

(function(define) {
	
	define([], function() {
		return ['$scope','userService','storage', AppController];
	})
	
	function AppController($scope, userService, storage) {
		var appCtrl = this;
		storage.reset();
		//setUpInitData
		_setupInitData(appCtrl, userService)
		
		//
	}
	
	
	function _setupInitData(appCtrl, userService) {
		_setUser(appCtrl, userService)
		
	}
	function _setUser(appCtrl, userService) {
		userService.getUser()
				   .then(function(user) {
						appCtrl.user = user;
					})
					.catch(function() {
						alert('login fail')
						var user = userService.getAnnoymousUser()
						appCtrl.user = user;  
					})
	}
	
})(define)