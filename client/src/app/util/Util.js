/**
 * 
 */

(function(define, angular, _) {
	
	define([], function(_) {
		
		return ['$q','$http', '$rootScope',makeUtil];
	
		function makeUtil($q, $http, $rootScope) {
			var U = {}
			
			U.$q = $q
			U.$http = $http
			U.$rootScope = $rootScope
			U._ = _;
			
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
			// --
			return U;
		}
	})
	////////////////
	

})(define, angular)