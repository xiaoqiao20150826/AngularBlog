/**
 * 
 */

(function(define, angular, _) {
	
	define([], function() {
		
		return ['$q','$http', '$window', makeUtil];
	
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

			//--------------------------------- --
			return U;
		}
	})
	////////////////
	

})(define, angular, _)