/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 *      
 *    TODO: jquery 의존성.함수. showloginview  
 */


(function(define,angular, $){
	define([], function() {
		return ['common.util','app.httpFailHandler', makeAuthService]
		function makeAuthService (U, httpFailHandler) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var authService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			

			authService.getLoginUser = function () {
				//주소주의
				return httpFailHandler.notifyAndDone( $http.get('/json/user/loginUser') )
			}
			
			authService.isLoginUserAbout = function (userId) {
				return httpFailHandler.notifyAndRedirect( $http.get('/json/auth/isLoginUser',{userId: userId}) )
			}
			// 서버세션에 로긴된 상태로 확인.
			authService.loginUserIsAdmin = function () {
				return httpFailHandler.notifyAndRedirect( $http.get('/json/auth/loginUserIsAdmin') )
			}
			//jquery 의존성....
			authService.showLoginView = function () {
				$('.bs-modal-login').modal('show')
			}
			//------------------------
			return authService;
		}
	})
})(define,angular, $)