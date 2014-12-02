/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [
		          '$scope'
		        , '$state'
		        , 'common.Tree'
		        , 'common.util'
		        , 'app.categoryDAO'
		        , AdminController];
	})
	
	function AdminController($scope, $state, Tree, U, categoryDAO) {
		// 데이터
		var $rootScope = $scope.$root
		$scope.rootOfCategory     = $rootScope.rootOfCategory
		
		$scope.selectedCategoryId = $rootScope.rootOfCategory.id
		$scope.newCategoryTitle   = ''
			
		//-----------------------------------------
			// categoryController 만들어야되지 않을까?
		
		var CATEGORY_CHILDSKEY = 'categories'	
		  , CATEGORY_IDKEY = 'id'	
		  , tree = new Tree($scope.rootOfCategory, CATEGORY_CHILDSKEY, CATEGORY_IDKEY)
		
		// watch
		$scope.$watch('selectedCategoryId', function (newId, oldId) {
			var node  = tree.first(newId)
			  , title = node.title
			  $scope.newCategoryTitle = title  
		});
		/// crud  
		this.insertCategory = function () {
			var newTitle = $scope.newCategoryTitle
			var parentId  = $scope.selectedCategoryId
			
			if(_.isEmpty(newTitle)) return alert('childName must dont empty')
			
			categoryDAO.insert(newTitle, parentId)
						.then(function(insertedCategory) {
							alert('insert : '+  JSON.stringify(insertedCategory.title))
							
							var parentNode = tree.first(parentId)
							tree.addChild(parentNode, insertedCategory)
							
							// 초 기 화
							$scope.selectedCategoryId = $rootScope.rootOfCategory.id
						})
			
		}
		this.deleteCategory = function () {
			var categoryId  = $scope.selectedCategoryId
			
			categoryDAO.delete(categoryId)
					   .then(function(result) {
						   alert(JSON.stringify(result))
						   
						   tree.drop(categoryId)
						   
						    // 초기화..중복.
							$scope.selectedCategoryId = $rootScope.rootOfCategory.id
					   })
			
		}
		this.updateCategory = function () {
			var categoryId  = $scope.selectedCategoryId
			var newTitle = $scope.newCategoryTitle
			
			if(_.isEmpty(newTitle)) return alert('childName must dont empty')
			
			categoryDAO.update(newTitle, categoryId)
						.then(function(result) {
							alert(JSON.stringify(result))
							
							var node = tree.first(categoryId)
							node.title = newTitle;
							
							//타이틀 유지..
//							$scope.newCategoryTitle = "";
						})
			
		}
			
	}
	
})(define, _)