
(function(define,angular){
	define([], function() {
		return ['common.util', makeAnswerDAO]
		function makeAnswerDAO (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var answerDAO = {}
			
			answerDAO.insertAnswer = function (answer) {
				return $http.post('/json/blogBoard/answer/insert',answer)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			
			//------------------------
			return answerDAO;
		}
	
	
	})
})(define,angular)