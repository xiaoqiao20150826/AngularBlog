
(function(define,angular){
	define([], function() {
		return ['common.util', makeAnswerDAO]
		function makeAnswerDAO (U) {
			var $q = U.$q
			  , $http = U.$http
			
			//----------------------
			var answerDAO = {}
			
			answerDAO.getRootOfAnswer = function (postNum) {
				var params = {postNum : postNum}
				return $http.get('/json/blogBoard/answer/list', {params: params})
				.catch(U.catch)
				.then(U.notifyAndDoneIfFail)
			}
//			postNum in anwer
			answerDAO.insert = function (answer) {
				return $http.post('/json/blogBoard/answer/insert',answer)
				.catch(U.catch)
				.then(U.notifyAndDoneIfFail)
			}
//			postNum in anwer
			answerDAO.update= function (answer) {
				return $http.post('/json/blogBoard/answer/update',answer)
							.catch(U.catch)
							.then(U.notifyAndDoneIfFail)
			}
			//includedNums , postNum in anwer
			answerDAO.delete = function (answer) {
				return $http.post('/json/blogBoard/answer/delete',answer)
				.catch(U.catch)
				.then(U.notifyAndDoneIfFail)
			}
			
			//------------------------
			return answerDAO;
		}
	
	
	})
})(define,angular)