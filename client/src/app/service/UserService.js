/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['util','storage', makeUserService]
		function makeUserService (U, storage) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var userService = {}
			userService.getLoginUser = function () {
				var defer = $q.defer()
				
				var user = storage.getUser();
				if(U.exist(user)) {
					return defer.resolve(user);
				}
				
				$http.get('/user/loginUser')
				     .then(function(userString) {
				    	 var user = JSON.parse(userString)
				    	 storage.setUser(user)
				    	 
				    	 return defer.resolve(user);
				     })
				
				return defer.promise
			}
			
			return userService;
		}
	
	
	})
})(define,angular)