/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['common.util', makeBlogBoardService]
		function makeBlogBoardService (U, storage) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var blogBoardService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			blogBoardService.getListData = function (param) {
				parama = param || {};
				return  $http.get('/json/blogBoard/list', {params:param})
						     .then(function(response) {
						    	 var listData = response.data
						    	 return listData;
						     })
						     .catch(function () {
						    	 alert(arguments)
						     })
			}
			//------------------------
			return blogBoardService;
		}
	
	
	})
})(define,angular)