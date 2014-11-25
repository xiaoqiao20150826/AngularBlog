/**
 * 
 */


(function (define, angular){
	define(	  [ 
	       	    'common/service/util'
	       	    
	       	  , 'common/service/ObjectDecorator'
	       	  , 'common/service/objectLogger'
	       	  , 'common/service/TreeExplorer'
	       	  
	       	  , 'common/provider/inspectLoggerProvider'
	       	  
	       	  , 'common/directive/treeExplorerDirective'
	       	  ]
	,function ( 
				util 
				
			  , ObjectDecorator
			  , objectLogger
			  , TreeExplorer
			  
			  , inspectLoggerProvider
			  
			  , treeExplorerDirective //directive
			  
	){
		
		var moduleName = 'common'          //얘는 app에 속하지않네.
		angular.module(moduleName, [])
		       .factory( moduleName + '.util', util)
		       
		       .factory( moduleName + '.ObjectDecorator', ObjectDecorator)
		       .factory( moduleName + '.objectLogger', objectLogger)
		       .factory( moduleName + '.TreeExplorer', TreeExplorer)
		       
		       .provider(moduleName + '.inspectLogger' , inspectLoggerProvider)		//이름주의.
		       
		       .directive('treeExplorer', treeExplorerDirective)
		
		return moduleName;
	})
	
})(define, angular)