/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return ['$scope', '$state', 'common.util', AdminController];
	})
	
	function AdminController($scope, $state, util) {
		// 데이터
		$scope.categories = {id:1, title:'t1', categories:[
		                                                     {id:2, title:'t2'}
		                                                    ,{id:3, title:'t3',categories : [
		                                                                                     {id:4, title:'t4'}
		                                                                                    ,{id:5, title:'t5', categories:[{id:6, title:'t6'}]}
		                                                                                    ]
		                                                     }
		                                                 ]
		                     }
		                    ,{id:7,title:'t7'} 
		$scope.selectedCategory = $scope.categories.categories[0]  
	}
	
})(define, _)