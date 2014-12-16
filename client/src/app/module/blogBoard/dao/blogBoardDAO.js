//   [주의
// 1. get호출시 params 속성에 객체 담아서 보내야함.
// 2. catch , then 순서 주의.

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
//				console.log(params)
				return $http.get('/json/blogBoard/list', {params:params})
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			//update 시 resolve하는건데. 실패시 일반 insert로 가니... redirect로
			blogBoardDAO.getPost = function (postNum) {
				return $http.get('/json/blogBoard/post', {params: {'postNum':postNum} })
							.catch(U.catch)
							.then(U.notifyAndRedirectIfFail)
			}
			//분리해도되겠네.
			blogBoardDAO.getPostAndIncreaseReadCount = function (postNum) {
				return $http.get('/json/blogBoard/detail', {params: {'postNum':postNum} })
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			blogBoardDAO.getHistory = function () {
				return $http.get('/json/blogBoard/history')
				.catch(U.catch)
				.then(U.notifyAndRedirectIfFail)
			}
			blogBoardDAO.insertPost = function (post) {
				return $http.post('/json/blogBoard/insert', post)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			blogBoardDAO.updatePost = function (post) {
				return $http.post('/json/blogBoard/update', post)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			blogBoardDAO.increaseVote = function (postNum) {
				return $http.post('/json/blogBoard/increaseVote', {postNum:postNum} )
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			blogBoardDAO.deletePost = function (writerId, postNum) {
				return $http.post('/json/blogBoard/delete', {postNum:postNum , writerId: writerId} )
				.catch(U.catch)
				.then(U.notifyAndDoneIfFail)
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
							.catch(U.catch)				
							.then(U.notifyAndDoneIfFail)
			}
			
			//------------------------
			return blogBoardDAO;
		}
	
	
	})
})(define,angular)