/**
 * 
 */

(function(define, angular, _) {
	
	define([], function() {
		
		return ['$q','$http', '$window', 'common.redirector', makeUtil];
	
		function makeUtil($q, $http, $window, redirector) {
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
			U.getAndRemove = function (o, key) {
				var value = o[key];
				delete o[key]; //for문에서 없에기위해..
				return value;
			}
			
			U.stringToBoolean = function (str) {
				if(U.notExist(str)) return null;
				
				if(str.trim().toLowerCase() === "false") return false
				else return true;
			}
			U.repeatString = function (string, num) {
				var repeatedString = ''
					_.each(_.range(num), function () {
						repeatedString = repeatedString + string
					})
				return repeatedString;
			}

			U.title4url = function (title) {
				return title.trim().replace(/\s+/g, '-')
//				return $window.decodeURI(title, 'utf-8');
			}
			
			
			
			
			
			//	간단한 사용하려고 여기서 하지만.... 이 위치가 옳을까?
			// 서버 요청 실패 알림.
			U.catch = function(res) {
				var resObj = {data : {isFail:true, obj: {message: res.data, obj: res } } }
				U.notifyAndRedirectIfFail(resObj)
			}
			// TODO: 아래 중복..부분나중에.
			// 실패시에는 알림작업만하고 실패 처리는 catch 로.
			U.notifyAndDoneIfFail = function (res) {
				var result  = res.data
				if(!result.isFail) return result.obj;
				
				var deferred = $q.defer()
				
				_notify(result)
				deferred.reject(result);
				
				return deferred.promise;  //then은 동작하지 않지만 catch는 동작함 
			}
			// 실패시에는 redirect
			U.notifyAndRedirectIfFail = function (res) {
				var result  = res.data
				if(!result.isFail) return result.obj;
				
				var deferred = $q.defer()
				
				_notify(result)
				redirector.goBefore()
						  .then(function() {
							  deferred.reject(result);			  
						  })	
				
				return deferred.promise  //then은 동작하지 않지만 catch는 동작함
			}
			// 이게 fail, catch일때 알림이야.
			function _notify(result) {
				var obj 	     = result.obj
				  ,	error		 = (obj && obj.error) ? obj.error  : obj 
				  , message      = error.message || error
				  
			    	alert(message)
			    	console.error(message , error)
			}
			
			

			//--------------------------------- --
			return U;
		}
	})
	////////////////
	

})(define, angular, _)