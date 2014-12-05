/**
 * 
 */

(function(define, _) {
	
	define([], function() {
		return [  '$scope'
		        , 'common.util'
		        , 'app.blogBoard.answerDAO'
		        , AnswerController];
	})
	
	function AnswerController($scope, U, answerDAO) {
		
		// data 관련은 이쪽에.. 바로사용할수있도록.
		var $root   = $scope.$root
		  , $parent	= $scope.$parent
		
		var post 	= $parent.post  
		  , postNum = post.num 
		$scope.answers = post.answers
		$scope.answer  = { userId : $root.currentUser._id , postNum:postNum}

		///
		this.insert = function (answer) {
			console.log(answer)
		}
	}
	
	
	
})(define, _)