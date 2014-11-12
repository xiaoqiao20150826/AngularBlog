/**
 * 
 */
(function(define, _){
	define([], function ( ) {
		return ['$window', getObjectLogger]
	}) 
	
	// 싱글톤.
	var cachedLogger;
	function getObjectLogger($window) {
		if(cachedLogger) return cachedLogger;
		
		var console = $window.console
		////
		var objectLogger = {}
		
		//json에서 function은 null이 됨. 주의.
		objectLogger.argsToJsonList = function (args) {
			var stringList = _.reduce(args, function (memo, v, i) {
				if(_.isArray(v) || (_.isObject(v) && !_.isFunction(v)) ) {
					var str = 'ㄴ-------> arg('+ (i+1) +') : '
					  , jsonString = JSON.stringify(v)
					  
					memo.push(str + jsonString)
				}
				return memo;
			},[])
			return stringList
		}
		
		objectLogger.log = makeDelegate(console, console.log)
		objectLogger.log4arg = function () {
			var jsonList = objectLogger.argsToJsonList(arguments)
			objectLogger.log.apply(null, arguments)
			objectLogger.log(jsonList)
			
		}
		objectLogger.warn = makeDelegate(console, console.warn)
		objectLogger.error = makeDelegate(console, console.error)
		objectLogger.info = makeDelegate(console, console.info)
		
		///////////////
		return cachedLogger = objectLogger;
	}
	///
	function makeDelegate(obj, fn) {
		return function () {
            var now     =  '['+Date.now()+']'
              , args    = [].slice.call(arguments)
            args.unshift(now)
			return fn.apply(obj, args)
		}
	}
	
})(define, _)