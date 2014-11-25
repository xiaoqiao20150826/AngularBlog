/**
 *     
 */


(function(define,angular){
	define([], function() {
		return ['common.util','app.httpFailHandler', makeUserService]
		function makeUserService (U, httpFailHandler) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var userService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			userService.update = function (user) {
				return    httpFailHandler.notifyAndDone( $http.post('/json/user/update', user) )
			}
			//------------------------
			return userService;
		}
	
	
	})
})(define,angular)