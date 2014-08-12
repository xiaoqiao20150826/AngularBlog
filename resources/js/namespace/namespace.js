/*
 * 
 *   
 *    
 */
var parentModule = this;

(function () {
	var namespace = parentModule.namespace = {};
	
	namespace.moduleLoader = parentModule.moduleLoader; //test
	namespace.moduleManager = parentModule.moduleManager; //test
	
	
	namespace.include = function (moduleFunction) {
		this.moduleLoader.setCurrentLoadedModule(moduleFunction);
	}
	
	
	namespace.load = function (modulePaths, callbackOfUser) {
		if(!( ((typeof modulePaths) == 'string') || modulePaths instanceof Array) ) throw new Error('first arg must be modulePaths is String or Array')
		
		var callbackOfUser = callbackOfUser || function () {}
		  , doAfterAllLoadModules = doAfterAllLoadModules1(callbackOfUser)
		  , noDuplicateOrderedModulePaths = this.getNoDuplicateModulePaths(modulePaths);
		  
		this.setOrderedModulePaths(noDuplicateOrderedModulePaths);
		
		if(noDuplicateOrderedModulePaths.length > 0) 
			return 	this.moduleLoader.load(doAfterAllLoadModules, noDuplicateOrderedModulePaths);
		else 
			return doAfterAllLoadModules(this.moduleManager.getCurrentStatus());
	}
	
	var _orderedModulePaths = [];
	namespace.getNoDuplicateModulePaths = function (modulePaths) {
		if((typeof modulePaths) == 'string') modulePaths = [modulePaths];
		
		var noDuplicateOrderedModulePaths = [];
		for(var i in modulePaths) {
			var modulePath = modulePaths[i]
			if(_orderedModulePaths.indexOf(modulePath) == -1 )
				noDuplicateOrderedModulePaths.push(modulePath);
		}
		return noDuplicateOrderedModulePaths;
	}
	namespace.setOrderedModulePaths = function (noDuplicateOrderedModulePaths) {
		_orderedModulePaths = _orderedModulePaths.concat(noDuplicateOrderedModulePaths);
	}
	
	namespace.getOrderedModulePaths = function () {
		if(_orderedModulePaths == null) throw new Error('modulePaths is not exist')
		
		return _orderedModulePaths;
	}
	function doAfterAllLoadModules1(callbackOfUser) {
		if(!(callbackOfUser instanceof Function) ) throw new Error('callback of user must be function')
		return function doAfterAllLoadModules (currentStatus) {
			if(currentStatus.isError()) {
				console.error('load fail : '+ currentStatus.getErrorMessage())
				throw new Error('load fail : '+ currentStatus.getErrorMessage());
			}
			
			return runAndCallbackOfUserByExportedModules(callbackOfUser);
			
		}
		function runAndCallbackOfUserByExportedModules(callbackOfUser) {
			var moduleManager = namespace.moduleManager
			  , orderedModulePaths = namespace.getOrderedModulePaths()
			  , require = namespace.require;
			
			var exportedModules = [];
			for(var i in orderedModulePaths) {
				var modulePath = orderedModulePaths[i]
				  , module = moduleManager.getModule(modulePath);
							
			    if(module.isSuccess()) {
					try {
						//BeforeEachDo
						var exportedModule = module.run(require); //exports, require
						//AfterEachDo
						moduleManager.run(modulePath);
						if(exportedModule) exportedModules.push(exportedModule);
					} catch(e) {
						return console.error('Running Error['+module.path+'] : '+ e.stack);
					}
			    }
			}
			
			//all run complete
			callbackOfUser.call(namespace, namespace.require, exportedModules);
		}
		
	}
	//this로 module을 갖는다. // Module에 위치시켜도 될것같은데..
	namespace.require = function (modulePath) {
		
		var errMessage = ' is can not to require :' + modulePath
		if(this.path)  errMessage = this.path + errMessage;
		
		var moduleManager = namespace.moduleManager
		  , module = moduleManager.getModule(modulePath);
		
		if(!module.isRun()) throw new Error(errMessage);
		return module.getExports();
	}

})();