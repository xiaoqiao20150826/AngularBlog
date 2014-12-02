/**
 *     
 */


(function(define,angular){
	define([], function() {
		return ['common.util', makeUserDAO]
		function makeUserDAO (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var userDAO = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			userDAO.update = function (user) {
				return    $http.post('/json/user/update', user)
							   .then(U.notifyAndDoneIfFail)
							   .catch(U.catch)
			}
			//------------------------
			return userDAO;
		}
	
	
	})
})(define,angular)