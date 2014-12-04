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
			// TODO:  야들이.. redirect해버리면.. state에서 사용할때... admin 등의 false를 true로 못바꾸네?
			// catch는 동작하니... catch로 잡게해놨군.
			

			authDAO.getLoginUser = function () {
				return $http.get('/json/user/loginUser')
							.catch(U.catch)
							.then(U.notifyAndRedirectIfFail)
			}
			
			authDAO.loginUserEqual = function (userId) {
				return $http.post('/json/auth/loginUserEqual',{userId: userId})
							.catch(U.catch)
							.then(U.notifyAndRedirectIfFail)
			}
			// 서버세션에 로긴된 상태로 확인.
			authDAO.loginUserIsAdmin = function () {
				return $http.post('/json/auth/loginUserIsAdmin')
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