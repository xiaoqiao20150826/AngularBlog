/**
 * 
 */


(function (define, angular){
	define(	  [ 
	       	    'common/service/util'
	       	    
	       	  , 'common/service/ObjectDecorator'
	       	  , 'common/service/objectLogger'
	       	  , 'common/service/Tree'
	       	  , 'common/service/redirector'
	       	  
	       	  , 'common/provider/inspectLoggerProvider'
	       	  
	       	  , 'common/directive/treeExplorerDirective'
	       	  , 'common/directive/elementBindDirective'
	       	  ]
	,function ( 
				util 
				
			  , ObjectDecorator
			  , objectLogger
			  , Tree
			  , redirector
			  
			  , inspectLoggerProvider
			  
			  //directive
			  , treeExplorerDirective 
			  , elementBindDirective 
			  
	){
		
		var moduleName = 'common'          //얘는 app에 속하지않네.
		angular.module(moduleName, ['ui.router'])
		       .factory( moduleName + '.util', util)
		       
		       .factory( moduleName + '.ObjectDecorator', ObjectDecorator)
		       .factory( moduleName + '.objectLogger'	, objectLogger)
		       .factory( moduleName + '.Tree'	, Tree)
		       .factory( moduleName + '.redirector'		, redirector)
		       
		       .provider(moduleName + '.inspectLogger' 	, inspectLoggerProvider)		//이름주의.
		       
		       .directive(moduleName + 'TreeExplorer', treeExplorerDirective)
		       .directive(moduleName + 'ElementBind' , elementBindDirective)
		
		return moduleName;
	})
	
})(define, angular)