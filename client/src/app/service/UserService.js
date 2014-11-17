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
			userService.getUser = function () {
				var user = storage.getUser();
				if(U.exist(user) && user.isLogin ) { return $q.when(user); }
				
				return  $http.get('/json/user/loginUser')
						     .then(function(response) {
						    	 var user = response.data
						    	 storage.setUser(user)
						    	 return user;
						     })
			}
			userService.logout = function () {
				storage.setUser(userService.getAnnoymousUser())
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