/**
 * 
 */


(function(define,angular){
	define([], function() {
		return ['$q', '$http', UserService]
	})
	
	function UserService ($q) {
		
		console.log('userService')
		return {
			aa:11
		}
		
	}
	
	
})(define,angular)