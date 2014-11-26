/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$scope'
		        , '$state'
		        , 'common.util'
		        , 'app.categoryService'
		        , 'rootOfCategory'
		        , AdminController];
	})
	
	function AdminController($scope, $state, util, categoryService, rootOfCategory) {
		// 데이터
		$scope.rootOfCategory     = rootOfCategory
		$scope.selectedCategoryId = rootOfCategory.id
		$scope.newCategoryTitle = ''
			
		//-----------------------------------------
		this.insertCategory = function () {
			var newTitle = $scope.newCategoryTitle
			var parentId  = $scope.selectedCategoryId
			
			if(_.isEmpty(newTitle)) return alert('childName must dont empty')
			
			categoryService.insert(newTitle, parentId)
						   .then(function(result) {
							   alert(result)
							   window.location.reload() //reload
						   })
			
		}
		this.deleteCategory = function () {
			var categoryId  = $scope.selectedCategoryId
			
			categoryService.delete(categoryId)
			.then(function(result) {
				alert(result)
//				window.location.reload() //reload
			})
			
		}
		this.updateCategory = function () {
			var categoryId  = $scope.selectedCategoryId
			var newTitle = $scope.newCategoryTitle
			
			if(_.isEmpty(newTitle)) return alert('childName must dont empty')
			
			categoryService.update(newTitle, categoryId)
			.then(function(result) {
				alert(result)
//				window.location.reload() //reload
			})
			
		}
			
	}
	
})(define, _)