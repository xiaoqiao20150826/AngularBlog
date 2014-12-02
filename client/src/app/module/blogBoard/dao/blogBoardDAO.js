/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['common.util', makeBlogBoardDAO]
		function makeBlogBoardDAO (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var blogBoardDAO = {}
			
			blogBoardDAO.getListData = function (param) {
				parama = param || {};
				return $http.get('/json/blogBoard/list', {params:param})
							.then(U.notifyAndDoneIfFail)
							.catch(U.catch)
			}
			blogBoardDAO.getDetailData = function (param) {
				parama = param || {};
				return $http.get('/json/blogBoard/detail', {params:param})
							.then(U.notifyAndDoneIfFail)
							.catch(U.catch)
			}
			
			//------------------------
			return blogBoardDAO;
		}
	
	
	})
})(define,angular)