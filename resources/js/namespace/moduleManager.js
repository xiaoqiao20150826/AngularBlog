/*
 *
 * 저장하여 관리  
 * 
 */


var parentModule = this;

(function() {
	//
	var Module = parentModule.Module
	  , Status = Module.Status;
	//
	var moduleManager = parentModule.moduleManager = {};
	
	moduleManager.path = parentModule.path
	moduleManager.Status = Status
	
	moduleManager.moduleMap  = {}; //복잡해지면 리파지터리로 분리할수도..
//	moduleManager.cachedModuleMap = {}; //유사 모듈패스와 실제 모듈패스를 바인딩시켜서 캐시가능.
	moduleManager.modulePaths = [];
	//
	moduleManager.ready = function (modulePath) { this.saveModule(modulePath, Status.READY) };
	moduleManager.start = function (modulePath) { this.saveModule(modulePath, Status.START) }
	moduleManager.loading = function (modulePath) {this.saveModule(modulePath, Status.LOADING)};
	moduleManager.error = function (modulePath) {this.saveModule(modulePath, Status.ERROR) };
	moduleManager.run = function (modulePath) {{this.saveModule(modulePath, Status.RUN) }}
	moduleManager.success = function (modulePath, loadedModule) {
		if(modulePath instanceof Array) throw new Error('modulePath must be One');
		if(isNotExist(loadedModule)) throw new Error('loadedModule must exsit');
		if(!(loadedModule instanceof Function)) throw new Error('loadedModule must instance of Function');
		
		this.saveModuleOne(modulePath, Status.SUCCESS, loadedModule)
	};
	
	moduleManager.saveModule = function (modulePath, status) {
		if(!(modulePath instanceof Array) ) modulePath = [modulePath]; 
		return this.saveModuleMany(modulePath, status);
	}
	moduleManager.saveModuleMany = function (modulePaths, status) {
		for(var i in modulePaths) {
			var modulePath = modulePaths[i];
			this.saveModuleOne(modulePath, status)
		}
	}
	moduleManager.saveModuleOne = function (similaireModulePath, status, loadedModule) {
		var moduleMap =  this.moduleMap
		  , modulePaths = this.getModulePaths()
		  , modulePath = this.path.getMostSimilaireModulePath(modulePaths, similaireModulePath)
		  , module = moduleMap[modulePath];
		
		var newModule = new Module(modulePath, status, loadedModule);
		
		if(isNotExist(module) || isExist(loadedModule)) {
			moduleMap[modulePath] = newModule;
		} else {
			moduleMap[modulePath].setStatus(status); //같은 모듈을 참조하니까 캐쉬 status변경안해도되겟지?
		}
	}
	
	moduleManager.getModules = function () { return this.moduleMap; }
	moduleManager.getModulePathsByStatus = function (status) {
		var modulePaths = []
		  , moduleMap = this.moduleMap;
		
		for(var key in moduleMap) {
			var module = moduleMap[key]
		      , modulePath = module.path;
			
			if(module.isStatus(status)) modulePaths.push(modulePath);
		}
		return modulePaths; 
	}
	moduleManager.getModule = function (similaireModulePath) {
		var moduleMap =  this.moduleMap
		  , modulePaths = this.getModulePaths()
		  , modulePath = this.path.getMostSimilaireModulePath(modulePaths, similaireModulePath)
		  , module = moduleMap[modulePath];
		
		return module;
	}
	moduleManager.isExistModule = function (similaireModulePath) {
		if(isExist(this.getModule(similaireModulePath)) ) return true;
		else return false;
	}
	
	moduleManager.getModulePaths = function () {
		return this.modulePaths;
	}
	// 중복되지 않은 이름이 되도록은 namespace에서 걸러놨음.
	moduleManager.setModulePath = function (modulePath) { 
		this.modulePaths.push(modulePath);
	}
	
	moduleManager.getStatus = function (similaireModulePath) {
		return this.getModule(similaireModulePath).getStatus();
	}
	moduleManager.getPath = function (similaireModulePath) {
		return this.getModule(similaireModulePath).getPath();
	}
	//
	
	moduleManager.getCurrentStatus = function () {
		var currentStatus = this.makeEmptyCurrentStatus()
		
		var moduleMap = this.moduleMap
		  , moduleMapCount = countByObject(moduleMap)
		  , successCount = 0;
		  
		for(var i in moduleMap) {
			var module = moduleMap[i];
			if(module.isStatus(Status.RUN)) {
				currentStatus.status = Status.RUN;
				currentStatus.modules.push(module)
			}
			if(module.isStatus(Status.ERROR)) {
				currentStatus.status = Status.ERROR;
				currentStatus.modules.push(module)
				currentStatus.message = 'error';
			}
			//제일마지막이어야한다.
			if(module.isStatus(Status.SUCCESS)) {
				successCount = successCount + 1;
				if(moduleMapCount == successCount) {
					currentStatus.status = Status.ALL_SUCCESS;
					currentStatus.message = 'all success';
				}
			} 
		}
		return currentStatus;
	}
	function countByObject(o) {
		if(!(o instanceof Object)) throw new Error('#countByObject : arg must be object')
		return Object.keys(o).length;
	}
	
	moduleManager.makeEmptyCurrentStatus = function (status) {
		status = status || 'emptyStatus'
		var currentStatus = {status:status, message:'', modules:[]};
		currentStatus.__proto__ = Module.getEmpty();
		return currentStatus;
	}
	
	moduleManager.removeAll = function () {
		this.moduleMap = {}
//		this.cachedModuleMap = {}
		this.modulePaths = []
	}
	////
	function isExist(o) {
		return !isNotExist(o);
	}
	function isNotExist(o) {
		if(o == null || o == undefined) return true;
		return false;
	}
	
	
})()
//@ sourceURL=util/moduleManager.js