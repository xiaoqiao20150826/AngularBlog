/**
 *   app의 임시 저장공간으로 window.sessionStorage 사용 중.
 */

(function(define,angular){
	define([], function() {
		return ['$sessionStorage','util', makeStorage];
		
	
		function makeStorage ($storage, U) {
			// make
			var storage = {}
			storage.get = function (key) {
				return $storage[key]
			}
			storage.set = function (key, value) {
				if(U.notExist(value) || U.notExist(key)) return console.error('cannot set key and val to storage')
				
				$storage[key] = value;
			}
			storage.getUser = function () { return storage.get('user')}
			storage.setUser = function (user) { return storage.set('user', user)}
			
			
			// exports
			return storage; 
			
		}
	})
	
})(define,angular)