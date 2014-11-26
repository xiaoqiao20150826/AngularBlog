/**
 */


(function(define,angular){
	define([], function() {
		return ['common.util','app.httpFailHandler', makeCategoryService]
		function makeCategoryService (U, httpFailHandler) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var categoryService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			categoryService.insert = function (newTitle, parentId) {
				var param = { newTitle : newTitle, parentId : parentId}
				return httpFailHandler.notifyAndDone( $http.post('/json/blogBoard/category/insert', param) )
			}
			categoryService.delete = function (categoryId) {
				var param = { categoryId : categoryId}
				return httpFailHandler.notifyAndDone( $http.post('/json/blogBoard/category/delete', param) )
			}
			categoryService.update = function (newTitle, categoryId) {
				var param = { newTitle : newTitle, categoryId : categoryId}
				return httpFailHandler.notifyAndDone( $http.post('/json/blogBoard/category/update', param) )
			}
			categoryService.getRootOfCategory = function () {
				return httpFailHandler.notifyAndDone( $http.get('/json/blogBoard/category/list') )
			}
			//------------------------
			return categoryService;
		}
	
	
	})
})(define,angular)