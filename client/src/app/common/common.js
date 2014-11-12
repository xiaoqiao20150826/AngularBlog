/**
 * 
 */


(function (define, angular){
	define(	  [ 'common/util'
	       	  , 'common/log/ObjectDecorator'
	       	  , 'common/log/objectLogger'
	       	  , 'common/log/inspectLoggerProvider'
	       	  ]
	,function ( util 
			  , ObjectDecorator
			  , objectLogger
			  , inspectLoggerProvider) {
		
		var moduleName = 'app.common'
		angular.module(moduleName, [])
		       .factory( 'util', util)
		       .factory( 'ObjectDecorator', ObjectDecorator)
		       .factory( 'objectLogger', objectLogger)
		       .provider('inspectLogger' , inspectLoggerProvider)		//이름주의.
		
		return moduleName;
	})
	
})(define, angular)