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
			userDAO.update = function (user) {
				return    $http.post('/json/user/update', user)
							   .catch(U.catch)
							   .then(U.notifyAndDoneIfFail)
			}
			userDAO.delete = function (userId) {
				return    $http.post('/json/user/delete', {userId : userId})
							   .catch(U.catch)
							   .then(U.notifyAndDoneIfFail)
			}
			//------------------------
			return userDAO;
		}
	
	
	})
})(define,angular)