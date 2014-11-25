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
			U.isPromise = function (p) {
				if(_.isFunction(p.then) && _.isFunction(p.catch)) return true
				else return false;
			}
			U.isNotPromise = function (p) {
				return !U.isPromise(p)
			}
			///
			U.date = function (dateStr) {
				return new Date(dateStr).toLocaleString()
			}
			U.stringToBoolean = function (str) {
				if(_.isEmpty(str)) return false;
				
				if(str.trim().toLowerCase() === "false") return false
				else return true;
			}
			
			// json 요청에 대한 응답의 공통적인 성공/실패 확인 함수.
			U.validResponse = function(res) {
				if(!res.data.isSuccess) {
					alert(res.data.obj.message, res.data.obj.error)
					return console.error(res.data.obj)
				}
				
				return res.data.obj
			}

			//--------------------------------- --
			return U;
		}
	})
	////////////////
	

})(define, angular, _)