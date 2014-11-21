/**
 */


(function(define,angular){
	define([], function() {
		return ['common.util', makeCategoryService]
		function makeCategoryService (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var categoryService = {}
			// TODO: logout을 통하지 않으면 계속 남을텐데.. 그냥 호출시마다 요청하는걸로?
			categoryService.update = function (category) {
				return     $http.post('/json/category/update', category)
								.then(function(response) { return response.data})
								.catch(function(err){console.error(err)})
			}
			categoryService.getCategories = function () {
				return     $http.get('/json/blogBoard/categories')
								.then(function(response) {return response.data.obj})
								.catch(function(err){console.error(err)})
			}
			//------------------------
			return categoryService;
		}
	
	
	})
})(define,angular)