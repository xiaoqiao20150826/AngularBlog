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
		
		inspectLogger.decorate('$rootScope')
//					 .inspect('$emit:before', commonLogFn, stateEventFilter)
//					 .inspect('$emit:after', function(o) {
//						 this.log(o.name 
//								, 'current scope: '+o.currentScope
//								, 'defaultPrevented:'+o.defaultPrevented)
//					 });
					 
		inspectLogger.decorate('$state')
					 .inspect('transitionTo:before', function (extend) {
						 this.log(extend)
//						 this.log(_.keys(extend))
					 })			 
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