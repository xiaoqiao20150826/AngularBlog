/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['common.util','app.storage', makeUserService]
		function makeUserService (U, storage) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var userService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			userService.getLoginUser = function () {
				var loginUser = storage.getLoginUser();
				if(U.exist(loginUser) && loginUser.isLogin ) { return $q.when(loginUser); }
				
				return  $http.get('/json/user/loginUser')
						     .then(function(response) {
						    	 var loginUser = response.data
						    	 storage.setLoginUser(loginUser)
						    	 return loginUser;
						     })
			}
			userService.logout = function () {
				storage.setLoginUser(userService.getAnnoymousUser())
				return  $http.get('/json/user/logout')
			}
			userService.getAnnoymousUser = function () {
				return  { name : 'Annoymous'
					    , isLogin : false 
					    }
			}
			//------------------------
			return userService;
		}
	
	
	})
})(define,angular)