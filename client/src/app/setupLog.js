/**
 * 
 */

(function(define, _) {
	define([], function () {
		var setupLog = {
							config : [ 'common.inspectLoggerProvider', setupLogConfig]
						 ,  run	   : [ 'common.inspectLogger', setupLogRun] 
					   }	
		return setupLog
	})

	// -----------------------------------------------------
	
	function setupLogConfig(inspectLoggerProvider) {
		
		var serviceInfoes = {}
		serviceInfoes.$rootScope =   {
										methodNames : [ 
										              ]
//								  ,	filter 		:
								  }
		
//		inspectLoggerProvider.setServiceInfoes(serviceInfoes)
	}
	
	// -----------------------------------------------------
	
	function setupLogRun (inspectLogger) {
		
		var stateEventFilter = makeSimulausEventFilter(['$state','$view'])
		  , locationEventFilter = makeSimulausEventFilter(['$location'])
		
//		inspectLogger.decorate('$rootScope')
//					 .inspect('$broadcast', commonLogFn, locationEventFilter)
//					 .inspect('$digest:before', commonLogFn)
//					 .inspect('$watch:before', commonLogFn)	//지시자들이 많이쓰는군.
//					 .inspect('$emit:after', function(o) {
//						 this.log(o.name 
//								, 'current scope: '+o.currentScope
//								, 'defaultPrevented:'+o.defaultPrevented)
//					 });
//		.inspect('$apply:before', function () {
//			 this.origin, this.obj,  this./?? /// 암튼 이런식으로 원래 객체 접근할수있게.
//		 })
		
//		inspectLogger.decorate('$location')
//					 .inspect('url:before', commonLogFn)
//					 .inspect('url:after+', commonLogFn)
		inspectLogger.decorate('$resolve')
					 .inspect('resolve:before', commonLogFn)
//					 .inspect('resolve:after', commonLogFn)
					 
		inspectLogger.decorate('$state')
					 .inspect('transitionTo:before', commonLogFn)
					 .inspect('transitionTo:after',function (promise) {
						 var $$state = promise.$$state
						 var self = this
					     promise.then(function () {
							 self.log($$state.value, 'views :'+JSON.stringify($$state.value.views))
					     })
						 
					 })			 
	}
	/// helper
	function commonLogFn() {
		this.log([].slice.apply(arguments))
	} 
	function makeSimulausEventFilter (eventNames4filter) {
		if(!( _.isArray(eventNames4filter)) ) return console.error(eventNameList + 'must be array')
		return function (eventName) {
			
			var isRun = false;
			_.each(eventNames4filter, function (eName4filter) {
//				var  regExp = RegExp(eName + '[A-Za-z0-9]*') //뭐여..어떻게해야하는겨.
				if( eventName.indexOf(eName4filter) !== -1 ) isRun = true;  // 하나라도 포함되면 false.
			})
			return isRun;
		}
		
	}
	
})(define, _);