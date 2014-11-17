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
		
		var moduleName = 'common'
		angular.module(moduleName, [])
		       .factory( moduleName + '.util', util)
		       .factory( moduleName + '.ObjectDecorator', ObjectDecorator)
		       .factory( moduleName + '.objectLogger', objectLogger)
		       .provider(moduleName + '.inspectLogger' , inspectLoggerProvider)		//이름주의.
		
		return moduleName;
	})
	
})(define, angular)