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
		var newContext = Package.includeNewContextToContext(packageName, context);
		var package = new Package(packageName, newContext);
		
		return package;
	}
	
///////////////////////	
	// Package class
	function Package(packageName, context) {
		this.packageName = packageName;
		this.context = context;
		this.export = context;
	}
	// static Function
	Package.includeNewContextToContext = function (packageName, context) { 
		if(packageName == null || packageName == undefined) throw console.error('need a param');
		if(typeof packageName != 'string') throw console.error('should be param typeof String');
		
		var currentContext = context; //
		var includedContextNames = packageName.split('.')

		for (var i in includedContextNames) {
			var includedContextName = includedContextNames[i]
			  , includedContext = currentContext[includedContextName];
			
			if(!(_isExistObject(includedContext) )) {currentContext[includedContextName] = {};}
			
			currentContext = currentContext[includedContextName];
		}
		return currentContext;
	}
	
	
	// 참조 모듈
	Package.prototype.moduleLoader = parentModule.moduleLoader;
	Package.prototype.path = parentModule.path;
	
	// instance function
	Package.prototype.package = function (packageName) {
		var context = this.context
		  , newContext = Package.includeNewContextToContext(packageName, context)
		  , newPackageName = this.packageName + _firstCharMustDot(packageName)
		  , package = new Package(newPackageName, newContext);
		
		return package;
	}

	Package.prototype.import = function (moduleName) {
		var module = this.context[moduleName];
		if(_isExistObject(module)) return module;
		
		moduleName = this.path.firstCharMustBeDot(moduleName);
		var modulePathOfPackage = this.packageName + moduleName;
		
		var result = this.load(modulePathOfPackage);
		
		return result;
	}
	Package.prototype.load = function (modulePathOfPackage) {
		var isNotComplete = true;
		var currentStatus = null;
		return this.moduleLoader.loadByModulePathOfPackage(done, modulePathOfPackage, new Date());
		function done(currentStatus) {
			log('wwww')
			isNotComplete = false;
			return currentStatus = currentStatus;
		}
//		count=0;
//		while(isNotComplete) {
//			sleep(500);
//			++count
//		}//TODO
//		
//		log('while', (++count))
//		if(currentStatus.isError()) throw new Error('err : '+ modulePathOfPackage);
//		
		
//		return currentStatus; 
	}
	function sleep(milliseconds) {
		  var start = new Date().getTime();
		  for (var i = 0; i < 1e7; i++) {
		    if ((new Date().getTime() - start) > milliseconds){
		      break;
		    }
		  }
		}
	
	//private 
	function _isExistObject(o) {
		if(o && o instanceof Object) return true;
		else return false;
	}

	
	function _firstCharMustDot(str) {
		if(!str) throw 'packageName is not exsit';
		
		if(str.charAt(0) == '.') return str;
		else return '.'+str;
	}
	
	
	//
	return packageInterfaceMethod;
})(parentModule, window)

//@ sourceURL=namespace/Package.js