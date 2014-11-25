/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['common.util', 'app.httpFailHandler', makeBlogBoardService]
		function makeBlogBoardService (U, httpFailHandler) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var blogBoardService = {}
			
			blogBoardService.getListData = function (param) {
				parama = param || {};
				return httpFailHandler.notifyAndDone( $http.get('/json/blogBoard/list', {params:param}) )
			}
			blogBoardService.getDetailData = function (param) {
				parama = param || {};
				return httpFailHandler.notifyAndDone( $http.get('/json/blogBoard/detail', {params:param}) )
			}
			
			//------------------------
			return blogBoardService;
		}
	
	
	})
})(define,angular)