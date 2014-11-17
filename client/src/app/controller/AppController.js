/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope','app.userService','app.storage', AppController];
	})
	
	function AppController($scope, userService, storage) {
		// 전역 범위 접근.
		$scope._  = _
		console.log('appctrl')
		/// resolve로 값 설정하는 것.고려.할것.
		var appCtrl = this;
		storage.reset(); //user만. 초기화해야할까?
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
	
})(define, _)