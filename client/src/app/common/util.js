/**
 * 
 */

(function(define, angular, _) {
	
	define([], function() {
		
		return ['$q','$http', '$window', '$rootScope',makeUtil];
	
		function makeUtil($q, $http, $window) {
			var Date = $window.Date
			
			var U = {}
			
			U.$q = $q
			U.$http = $http
			
			// --
			U.exist = function(o) {
				if(o != null || o != undefined) return true;
				else return false;
			}
			U.notExist = function (o) {
				return !U.exist(o);
			}
			U.isEmpty = function (o) {
				return _.isEmtpy(o);
			}
			U.date = function (dateStr) {
				return new Date(dateStr).toLocaleString()
			}

			// 컨트롤러 인스턴스 전에 호출됨(리다이렉트때문)
			// 이걸 어떻게 처리하면 좋을까나...
			
			// --
			return U;
		}
	})
	////////////////
	

})(define, angular, _)