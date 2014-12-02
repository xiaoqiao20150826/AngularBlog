/**
 */


(function(define,angular){
	define([], function() {
		return ['common.util', makeCategoryDAO]
		function makeCategoryDAO (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var categoryDAO = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			categoryDAO.insert = function (newTitle, parentId) {
				var param = { newTitle : newTitle, parentId : parentId}
				return $http.post('/json/blogBoard/category/insert', param)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			categoryDAO.delete = function (categoryId) {
				var param = { categoryId : categoryId}
				return $http.post('/json/blogBoard/category/delete', param)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			categoryDAO.update = function (newTitle, categoryId) {
				var param = { newTitle : newTitle, categoryId : categoryId}
				return $http.post('/json/blogBoard/category/update', param)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			categoryDAO.getRootOfCategory = function () {
					return $http.get('/json/blogBoard/category/list')
								.catch(U.catch)
							    .then(U.notifyAndDoneIfFail)
			}
			//------------------------
			return categoryDAO;
		}
	
	
	})
})(define,angular)