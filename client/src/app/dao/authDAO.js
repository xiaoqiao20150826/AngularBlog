/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 *      
 *    TODO: jquery 의존성.함수. showloginview  
 */


(function(define,angular, $){
	define([], function() {
		return ['common.util', makeAuthDAO]
		function makeAuthDAO (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var authDAO = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			

			authDAO.getLoginUser = function () {
				//순서주의 .  실패시 리다이렉트 후 reject를하여 다른 catch를 실행하기위함.
				return $http.get('/json/user/loginUser')
							.catch(U.catch)
							.then(U.notifyAndRedirectIfFail)
			}
			
			authDAO.isLoginUserAbout = function (userId) {
				return $http.get('/json/auth/isLoginUser',{userId: userId})
							.catch(U.catch)
							.then(U.notifyAndRedirectIfFail)
			}
			// 서버세션에 로긴된 상태로 확인.
			authDAO.loginUserIsAdmin = function () {
				return $http.get('/json/auth/loginUserIsAdmin')
							.catch(U.catch)
							.then(U.notifyAndRedirectIfFail)
			}
			//jquery 의존성....
			authDAO.showLoginView = function () {
				$('.bs-modal-login').modal('show')
			}
			//------------------------
			return authDAO;
		}
	})
})(define,angular, $)