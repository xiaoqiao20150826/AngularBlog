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
			
			blogBoardDAO.getListData = function (params) {
				params = params || {};
				console.log(params)
				return $http.get('/json/blogBoard/list', {params:params})
							.then(U.notifyAndDoneIfFail)
							.catch(U.catch)
			}
			//update 시 resolve하는건데. 실패시 일반 insert로 가니... redirect로
			blogBoardDAO.getPost = function (postNum) {
				return $http.get('/json/blogBoard/post', {params: {'postNum':postNum} })
				.then(U.notifyAndRedirectIfFail)
				.catch(U.catch)
			}
			blogBoardDAO.getDetailData = function (params) {
				params = params || {};
				return $http.get('/json/blogBoard/detail', {params:params})
							.then(U.notifyAndDoneIfFail)
							.catch(U.catch)
			}
			blogBoardDAO.insertPost = function (post) {
				return $http.post('/json/blogBoard/insert', post)
				.then(U.notifyAndDoneIfFail)
				.catch(U.catch)
			}
			blogBoardDAO.updatePost = function (post) {
				return $http.post('/json/blogBoard/update', post)
				.then(U.notifyAndDoneIfFail)
				.catch(U.catch)
			}
			blogBoardDAO.increaseVote = function (postNum) {
				return $http.post('/json/blogBoard/increaseVote', {postNum:postNum} )
				.then(U.notifyAndDoneIfFail)
				.catch(U.catch)
			}
			// this
			blogBoardDAO.uploadImage = function (fileForm) {
				var req = {
					        'url'	  : '/file/upload'
					      , 'data'	  : fileForm
					      , 'method'  : 'POST'
					      , 'headers' : {'Content-Type': undefined}
						  //예제에 나온것처럼 사용한다면 여기에 form을 반환하는 함수.사용.	
						  , 'transformRequest' : angular.identity	   
	    				  }
				
				return $http(req)
							.then(U.notifyAndDoneIfFail)
							.catch(U.catch)				
			}
			
			//------------------------
			return blogBoardDAO;
		}
	
	
	})
})(define,angular)