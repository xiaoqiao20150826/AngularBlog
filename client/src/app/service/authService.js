/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['common.util','app.storage', makeAuthService]
		function makeAuthService (U, storage) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var authService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			

			authService.getLoginUser = function () {
				return  $http.get('/json/auth/loginUser')
							 .then(function(response) { return response.data.obj})
							 .catch(function(err){console.error(err)})
			}
			
			authService.isLoginUserAbout = function (userId) {
				return  $http.get('/json/auth/isLoginUser',{userId: userId})
							 .then(function(response) { return response.data.obj})
							 .catch(function(err){console.error(err)})
			}
			// 서버세션에 로긴된 상태로 확인.
			authService.loginUserIsAdmin = function () {
				return     $http.get('/json/auth/loginUserIsAdmin')
								.then(function(response) { return response.data})
								.catch(function(err){console.error(err)})
			}
			authService.showLoginView = function () {
				$('.bs-modal-login').modal('show')
			}
			//------------------------
			return authService;
		}
	})
})(define,angular)