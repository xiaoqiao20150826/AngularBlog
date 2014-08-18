/*
 * 
 *   
 *    
 */
var parentModule = this;

(function () {
	var namespace = parentModule.namespace = {};
	
	namespace.moduleLoader = parentModule.moduleLoader; 
	namespace.moduleManager = parentModule.moduleManager; 
	namespace.path = parentModule.path;
	
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
		var path = namespace.path
		if((typeof modulePaths) == 'string') modulePaths = [modulePaths];
		
		var noDuplicateOrderedModulePaths = [];
		for(var i in modulePaths) {
			var modulePath = modulePaths[i]
			  , similaireModulePath = path.getMostSimilaireModulePathWithNoThrow(_orderedModulePaths, modulePath);
			if(similaireModulePath == null) {
				modulePath = path.extensionMustBe('js',modulePath)
				noDuplicateOrderedModulePaths.push(modulePath);
			}
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
				
				for(var i in orderedModulePaths) {
					var modulePath = orderedModulePaths[i]
					  , module = moduleManager.getModule(modulePath);
					
					if(module.isRun()) {continue;}
				    if(module.isSuccess()) {
				    	var exportedModule = namespace.runOneModuleIfSuccess(module)
				    }
				}
				//all run complete
				callbackOfUser.call(namespace, namespace.require);
			}
			
		}
		namespace.runOneModuleIfSuccess = function (module) {
			try {
				var modulePath = module.path;
				//BeforeEachDo
				var exportedModule = module.run(namespace.require); //exports, require
				//AfterEachDo
				namespace.moduleManager.run(modulePath);
			} catch(e) {
				return console.error('Running Error['+module.path+'] : '+ e.stack);
			}
		}
		//this로 module을 갖는다. // Module에 위치시켜도 될것같은데..
		namespace.require = function (modulePath) {
			
			var errMessage = ' is can not to require :' + modulePath
			if(this.path)  errMessage = this.path + errMessage;
			
			var moduleManager = namespace.moduleManager
			  , module = moduleManager.getModule(modulePath);
			
			if(module.isSuccess()) { namespace.runOneModuleIfSuccess(module) };
			if(module.isRun()) return module.getExports(); 
			
			throw new Error(errMessage);
		}
	})()