/**
 * 
 */


var parentModule = this;
var window = this;

(function(parentModule, window) {
	
	//interface for parentModule
	var packageInterfaceMethod = parentModule.package = function makePackage(packageName) {
		if(!window) throw console.error('need window context');
		
		return includeNewContextToContextAndMakePackage(packageName, window);
	}
	
	function includeNewContextToContextAndMakePackage(packageName, context) {
		var newContext = includeNewContextToContext(packageName, context);
		var package = new Package(packageName, newContext);
		
		return package;
	}
	function includeNewContextToContext (packageName, context) { 
		if(packageName == null || packageName == undefined) throw console.error('need a param');
		if(typeof packageName != 'string') throw console.error('should be param typeof String');
		
		var currentContext = context; //
		var includedContextNames = packageName.split('.')

		for (var i in includedContextNames) {
			var includedContextName = includedContextNames[i]
			  , includedContext = currentContext[includedContextName];
			
			if(!(isExistObject(includedContext) )) {currentContext[includedContextName] = {};}
			
			currentContext = currentContext[includedContextName];
		}
		return currentContext;
	}
	function isExistObject(o) {
		if(o && o instanceof Object) return true;
		else return false;
	}
	
///////////////////////	
	// Package class
	var Package = function Package (packageName, context) {
		this.packageName = packageName;
		this.context = context;
		this.export = context;
	}
	Package.prototype.moduleLoader = parentModule.moduleLoader;
	Package.prototype.package = function (packageName) {
		var context = this.context
		  , newContext = includeNewContextToContext(packageName, context)
		  , newPackageName = this.packageName + firstCharMustDot(packageName)
		  , package = new Package(newPackageName, newContext);
		
		return package;
	}
	function firstCharMustDot(str) {
		if(!str) throw 'packageName is not exsit';
		
		if(str.charAt(0) == '.') return str;
		else return '.'+str;
	}
	
	Package.prototype.import = function (moduleName) {
		var module = this.context[moduleName];
		if(isExistObject(module)) return module;
		//없으면.
//		moduleLoader.
	}
	
	
	//
	return packageInterfaceMethod;
})(parentModule, window)

//@ sourceURL=namespace/Package.js