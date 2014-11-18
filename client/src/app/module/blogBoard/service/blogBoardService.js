/**
 *    - 유저정보는 세션스토리지 사용 
 *      ; 로그인 보안은 서버의 세션을 이용하여 확인하도록.
 */


(function(define,angular){
	define([], function() {
		return ['common.util', '$state', makeBlogBoardService]
		function makeBlogBoardService (U, $state) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var blogBoardService = {}
			
			blogBoardService.getListData = function (param) {
				parama = param || {};
				return  $http.get('/json/blogBoard/list', {params:param})
						     .then(function(response) {
						    	 var listData = response.data
						    	 return listData;
						     })
						     .catch(function (err) {
						    	 console.error(err)
						     })
			}
			blogBoardService.getDetailData = function (param) {
				parama = param || {};
				return  $http.get('/json/blogBoard/detail', {params:param})
							 .then(function(response) {
								 var detailData = response.data
//								 $state.go('app.blogBoard.list') //이상한데이터시 리다이렉트.
								 return detailData;
							 })
							 .catch(function (err) {
						 		 console.error(err)
						 	 })
			}
			
			
			//------------------------
			return blogBoardService;
		}
	
	
	})
})(define,angular)