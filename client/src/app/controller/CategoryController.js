/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$scope'
		        , '$state'
		        , 'common.util'
		        , 'app.categoryDAO'
		        , CategoryController];
	})
	
	function CategoryController($scope, $state, U, categoryDAO) {
		// 데이터
		var $root = $scope.$root
		
		$scope.rootOfCategory 		= $root.rootOfCategory;
		$scope.selectedCategoryId 	= $root.rootOfCategory.id;
		$scope.newTitle   	  		= '';
			
		//-----------------------------------------
		
		var tree = $root.categoryTree
		
		// watch
		$scope.$watch('selectedCategoryId', function (newId, oldId) {
			var node  = tree.first(newId)
			  , title = node.title
			$scope.newTitle = title  
		});
		/// crud 후 view 변화  
		
		this.insertCategory = function (categoryId, newTitle) {
			
			if(_.isEmpty(newTitle)) return alert('childName must dont empty')
			
			categoryDAO.insert(newTitle, categoryId)
						.then(function(insertedCategory) {
							alert('insert : '+  JSON.stringify(insertedCategory.title))
							
							var parentNode = tree.first(categoryId)
							tree.addChild(parentNode, insertedCategory)
							
							// 초 기 화
							$scope.selectedCategoryId  = $root.rootOfCategory.id
							$scope.newTitle    = $root.rootOfCategory.title
						})
			
		}
		this.deleteCategory = function (categoryId) {
			
			categoryDAO.delete(categoryId)
					   .then(function(result) {
						   alert(JSON.stringify(result))
						   
						   tree.drop(categoryId)
						   
						    // 초기화..
							$scope.selectedCategoryId  = $root.rootOfCategory.id
							$scope.newTitle    = $root.rootOfCategory.title
					   })
			
		}
		this.updateCategory = function (categoryId, newTitle) {
			
			if(_.isEmpty(newTitle)) return alert('childName must dont empty')
			
			categoryDAO.update(newTitle, categoryId)
						.then(function(result) {
							alert(JSON.stringify(result))
							
							var node = tree.first(categoryId)
							node.title = newTitle;
							
							//유지..
//							newTitle = ''
						})
			
		}
			
	}
	
})(define, _)