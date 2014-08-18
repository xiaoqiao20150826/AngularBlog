/*
 * TODO: 알고있는 위치의 필요파일을 불러오게끔 만들면 이렇게 몰아넣지 않아도 될텐데.
 * 
 *  $$namespace
 *     - 할당 위치
 *       : window.$$namespace  
 *     - 역할
 *       : path, moduleManager, moduleLoader, Module, namespace의 인터페이스.
 *   
 *  @parmas
 *    - this : 현재 페이지의 window
 *    
 */
(function () {
	var parentModule = {}; // 각 모듈의 참조를 저장하는 변수.
	setPath(parentModule, window);
	setModule(parentModule);
	setModuleManager(parentModule);
	setModuleLoader(parentModule, window, $);
	setNamespace(parentModule);	
	
	// 인터페이스
	var $$namespace = window.$$namespace = {};
	$$namespace.load = function (modulePaths, callbackOfUser) {
		return parentModule.namespace.load(modulePaths, callbackOfUser);
	}

	$$namespace.include = function (moduleFunction) {
		return parentModule.namespace.include(moduleFunction);
	}
	$$namespace.require = function (modulePath) {
		return parentModule.namespace.require(modulePath);
	}
	///////////////////////////////////////// 하위 모듈. //////////////////////////////////////
	
	
	/////////////////////// path
	function setPath(parentModule, window) {
		(function() {
	var location = window.location;
	if(location == null || location == undefined) throw new Error('window.location is not exist')
	//
	
	var path = parentModule.path = {};  
	
	
	//이름을 어떻게 바꿀까. 서버에 요청할 수 있는 모듈이름.(dir, 모듈이름, 확장자 포함된것)
	path.getFilePath = function (modulePath) {
		if(this.isUrl(modulePath)) return modulePath;
		
		if(this.isLocal()) return this.getLocalPath(modulePath);
		if(this.isServer()) return this.getServerPath(modulePath);
		
		throw 'current page is not server or local ';
	}
	path.isServer =  function () {
		return !(this.isLocal());
	}
	path.isLocal = function () {
		var host = location.host
		  , origin = location.origin;
		
		if(isEmpty(host) || (origin.match('file')) ) return true;
		else return false;
	}
	//modulePath의 시작이 http라면 url이다.
	path.isUrl = function (modulePath) {
		if(modulePath.indexOf('http') == 0) return true;
		else return false;
	}
	//sever
	path.getServerPath = function(modulePath) {
		var char = modulePath.charAt(0)
		
		if(isEmpty(modulePath)) throw 'modulePath not exist';
		if(isDot(char)) throw 'modulePath should be abs path for server';
		
		if(char != '/') {modulePath = '/' + modulePath;}
		
		modulePath = this.extensionMustBe('js', modulePath);
		
		return modulePath; 
	}
	//local
	path.getLocalPath= function (modulePath) {
		var localDir = this.getLocalDirByModulePath(modulePath)
		  , moduleName = this.getModuleName(modulePath);
		return localDir + '/' + moduleName;
	}
	path.getLocalDirByModulePath = function (modulePath) {
		var dirOfModulePath = this.getDirOfModulePath(modulePath)
		  , localDir = this.getLocalDirAboutCurrentPage()
		  , folderNames = dirOfModulePath.split('/');
		
		for(var i in folderNames) {
			var folderName = folderNames[i];
			
			if(isEmpty(folderName)) continue;
			if(isDot(folderName)) continue;
			
			if(isDoubleDot(folderName)) {
				localDir = removeLastFolderName(localDir);
			} else { //그외 문자
				localDir = localDir + '/'+folderName;
			}
		}
		return localDir;
	}
	path.getModuleName = function (modulePath) {
		if(isOnlyName(modulePath)) return modulePath;
		
		var startIndex = modulePath.lastIndexOf('/')
			name = modulePath.slice(startIndex+1)
			name = this.extensionMustBe('js', name);
		return name;
	}
	// 다른 확장자 변환은 안되고 js만 확인해서 붙임.
	path.extensionMustBe = function (extensionName, modulePath) {
		extensionName = this.firstCharMustBeDot(extensionName);
		
		if(!isExtension(modulePath, extensionName)) modulePath = modulePath + extensionName;
		return modulePath;
	};
	
	function removeLastFolderName(dir) {
		var lastIndex = dir.lastIndexOf('/');
		return dir.slice(0, lastIndex);
	}
	path.getMostSimilaireModulePathWithNoThrow = function(modulePath, modulePathOfPackage) {
		try {
			return path.getMostSimilaireModulePath(modulePath, modulePathOfPackage);
		} catch(e) {
			return null;
		}
	}
	//가장 일치하는 것.
	path.getMostSimilaireModulePath = function(modulePath, modulePathOfPackage) {
		
		var modulePathAndEqualCountList = this.getModulePathAndEqualCountList(modulePath, modulePathOfPackage);
		
		var maxEqualCount = 0
		  , mostSimilaireModulePath = null;
		for(var i in modulePathAndEqualCountList) {
			var modulePathAndEqualCount =  modulePathAndEqualCountList[i]
			  , modulePath = modulePathAndEqualCount.modulePath
			  , equalCount = modulePathAndEqualCount.equalCount;
			
			if(equalCount > maxEqualCount) {
				maxEqualCount = equalCount;
				mostSimilaireModulePath = modulePath;
			}
		}

		if(!mostSimilaireModulePath) 
			throw new Error('not found SimilaireModulePath from ' + modulePathOfPackage);
		else 
			return mostSimilaireModulePath;
	}
	
	path.getModulePathAndEqualCountList = function (modulePaths, modulePathOfPackage) {
		if(!(modulePaths instanceof Array) ) modulePaths = [modulePaths];
		return this.getModulePathAndEqualCountMany(modulePaths, modulePathOfPackage);
	}
	path.getModulePathAndEqualCountMany = function (modulePaths, modulePathOfPackage) {
		var modulePathAndEqualCountList = [];
		for(var i in modulePaths) {
			var modulePath = modulePaths[i]
			  , modulePathAndEqualCount =  this.getModulePathAndEqualCountOne(modulePath, modulePathOfPackage);
			
			modulePathAndEqualCountList.push(modulePathAndEqualCount)
		}
		
		return modulePathAndEqualCountList;
	}
	path.getModulePathAndEqualCountOne = function (modulePath, modulePathOfPackage) {
		var partsOfmodulePath = this.getRevesedPartsOfPath(modulePath, '/')
		  , partsOfmodulePathOfPackage = this.getRevesedPartsOfPath(modulePathOfPackage, '/') //성능향상 위해 캐쉬가능.
		  , minLength = getMinLength(partsOfmodulePath, partsOfmodulePathOfPackage);
		
		var equalCount = 0;
		for(var i = 0, max = minLength; i < max; ++i) {
			var partOfmodulePath = partsOfmodulePath[i]
			  , partOfmodulePathOfPackage = partsOfmodulePathOfPackage[i];
			
			if(partOfmodulePath === partOfmodulePathOfPackage)
				++equalCount;
			else 
				break; //다르면 범위를 벗어난거라 다음것비교안해봐도 된다.
		}
		return {modulePath : modulePath, equalCount : equalCount} 
	}
	function getMinLength(list1, list2) {
		return (list1.length < list2.length) ? list1.length : list2.length;
	}
	path.getRevesedPartsOfPath = function (path, spliter, isRemoveExtension) {
		path = this.removeExtension(path, 'js');
		
		path = path.toLowerCase();
		return path.split(spliter).reverse();
	}
	path.removeExtension = function(modulePath, extensionName) {
		extensionName = this.firstCharMustBeDot(extensionName);
		
		if(isExtension(modulePath, extensionName)) 
			return modulePath.slice(0, modulePath.lastIndexOf(extensionName)); 
		else 
			return modulePath;
	}
	path.getDirOfModulePath = function (modulePath) {
		if(isOnlyName(modulePath)) return '/';
		
		var endIndex = modulePath.lastIndexOf('/') +1
		  , dirOfModulePath = modulePath.slice(0, endIndex);
		
		if(dirOfModulePath.charAt(0) != '/') return '/' + dirOfModulePath;
		else return dirOfModulePath;  
	}
	
	path.getLocalDirAboutCurrentPage = function () {
		var pathname = location.pathname;
		var last = pathname.lastIndexOf('/')
		return pathname.slice(1,last)
	}
	path.firstCharMustBeDot = function (str) {
		var firstChar = str.charAt(0);
		if( !(isDot(firstChar)) ) str = '.' + str;
		return str;
	}
	function isExtension(modulePath, extensionName) { // .js   .붙여야함
		var lastIndex = modulePath.lastIndexOf('.')
		  , extension = modulePath.slice(lastIndex);
		if(extension == extensionName) 
			return true;
		else 
			return false;
	}
	function isOnlyName(modulePath) {
		if(modulePath.lastIndexOf('/') == -1) return true;
		else return false;
	}
	function isDot(str) {
		if(str == '.') return true;
		else return false;
	}
	function isDoubleDot(str) {
		if(str == '..') return true;
		else return false;
	}
	
	function isEmpty(str) {
		if(str == '' || str == "") return true;
		else return false;
	}
})()

	}
	/////////////////////// Path
	
	/////////////////////// Module
	function setModule(parentModule) {
(function() {
	
	//
	var Status = { READY:'ready', START:'start', LOADING:'loading'
			     , SUCCESS:'success', RUN:'run', ERROR:'error'
			     , ALL_SUCCESS : 'all success'
			     }
	//
	var Module = parentModule.Module = function(modulePath, status, loadedModule) {
		if(!modulePath) throw new Error('fail create Module instance because modulePath is null');
		
		this.path = modulePath;
		this.status = status || Module.Status.READY;
		this.loadedModule = loadedModule;
	};
	
	// static function
	Module.Status = Status; 
	
	
	// instance function
	Module.prototype.setStatus = function (statusName) {
		var upperStatusName = statusName.toUpperCase();
		if(!(Status[upperStatusName]) ) throw new Error('not exist status name : '+ statusName);
		
		this.status = statusName;
	}
	Module.prototype.getStatus = function () {return this.status;};
	Module.prototype.getPath = function () {return this.path;};
	Module.prototype.getModuleToRun = function () {
		var loadedModule = this.loadedModule;
		
		if(!this.isSuccess()) throw new Error('module status must be success')
		if(!isExist(loadedModule)) throw new Error('loadedModule dont exist');
		if(!(loadedModule instanceof Function)) throw new Error('loadedModule must be function');
			
		return loadedModule;
	};
	
	Module.prototype.isReady = function () {return this.isStatus(Status.READY)}
	Module.prototype.isStart = function () {return this.isStatus(Status.START)}
	Module.prototype.isLoading = function () {return this.isStatus(Status.LOADING)}
	Module.prototype.isSuccess = function () {return this.isStatus(Status.SUCCESS)}
	Module.prototype.isRun = function () {return this.isStatus(Status.RUN)}
	Module.prototype.isAllSuccess = function () {return this.isStatus(Status.ALL_SUCCESS)}
	Module.prototype.isError = function () {return this.isStatus(Status.ERROR)}
	Module.prototype.isStatus = function (statusName) {
		if(this.status == statusName) return true;
		else return false;
	}
	Module.prototype.getExports = function () {
		var exports = this.exports;
		if(!isExist(exports) ) throw 'not exist exports : '+ this.path;
		
		return exports;
	}
	
	Module.prototype.run = function (require) {
		this.exports = {};
		this.require = require;
		var moduleToRun = this.getModuleToRun();
		moduleToRun.call(this, require, this);
		
		if(isEmptyObject(this.exports)) return null;
		else return this.exports;
	}
	function isEmptyObject(o) {
		var keys = Object.keys(o);
		if(keys.length > 0) return false;
		else return true;
	}  
	Module.prototype.getExportedModule = function () {
		if(isExist(this.exports)) return this.exports;
		else return null;
	}
	
	var emptyModule = new Module('emptyPath');
	Module.getEmpty = function () {
		return emptyModule;
	}
	Module.prototype.getErrorMessage = function() {
		var message = '['+this.status+'] : ';
		if(this.message) message = message + '[message:' + this.message + '] -> ';
		
		var modules = this.modules;
		if(isExist(modules)) {
			for(var i in modules) {
				var module = modules[i]
				message = message + ', ' + module.path;
			}
		}
		return message;
	}
	
	function isExist (o) {
		if(o == null || o == undefined) return false;
		else return true;
	}
	
	
	
})()
	}
	/////////////////////// Module
	
	/////////////////////// moduleManager
	function setModuleManager(parentModule) {

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
				currentStatus.message = module.message;
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
	
	moduleManager.makeEmptyCurrentStatus = function (status, message) {
		status = status || 'emptyStatus';
		message = message || '';
		var currentStatus = {status:status, message:message, modules:[]};
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

	}
	/////////////////////// moduleManager
	
	/////////////////////// moduleLoader
	function setModuleLoader(parentModule, window, $) {
(function() {
	if(!$) throw 'required closer variable $';
	
	// outer ref
	var moduleLoader = parentModule.moduleLoader = {};
	
	
	// inner ref
	moduleLoader.path = parentModule.path				
	moduleLoader.moduleManager = parentModule.moduleManager
	
	
	// functions
	moduleLoader.load = function (done, modulePath) {
		if(modulePath instanceof Array) return this.loadMany(done, modulePath);
		else return this.loadOne(done, modulePath);
	};
	// 비동기적으로 모두 로딩하고 완료시 endDone호출.
	moduleLoader.loadMany = function(endDone, modulePaths) {
		var moduleManager= moduleLoader.moduleManager;
		
		modulePaths.forEach(function (modulePath) {
			moduleLoader.loadOne(callEndDoneIfEnd, modulePath);
		});
		
		var callbackCount = 0;
		var modulePathCount = modulePaths.length;
		function callEndDoneIfEnd() {
			++callbackCount;
			if(modulePathCount == callbackCount) {
				var getCurrentStatus = moduleManager.getCurrentStatus();
				return endDone(getCurrentStatus);
				
			} else {return;}
		}
	}

	moduleLoader.loadOne = function (done, modulePath) {
		if(modulePath ==null || modulePath == undefined) throw console.error('need a modulePath');
		var moduleManager = moduleLoader.moduleManager
		  , path = moduleLoader.path;
		
		modulePath = path.extensionMustBe('js', modulePath);
		moduleManager.setModulePath(modulePath);
		
		moduleManager.ready(modulePath);
		moduleLoader.$getScript(modulePath)
			 .done(function() {
				 asyncCallOnSuccess(done, modulePath)
			 })
			 .fail(function(o, errStatus, error) {
				 var errMessage = '['+modulePath+"] "+ ' : '+ error.stack; 
				 moduleManager.error(modulePath);
				 console.error(errMessage);
				 done(moduleManager.makeEmptyCurrentStatus(errStatus, errMessage));
			 });
	};
	
	
	/*
	 * 비동기 로드 후 스크립트가 자동 실행된다.
	 * 이 때 $$namespace.include(method) 를 실행되게 하여 실행할 모듈의 참조를 임시저장한다.
	 * 정상 완료 후 getScirpt의 콜백함수가 실행된다.
	 *   
	 */
	function asyncCallOnSuccess(done, modulePath) {
		var moduleManager = moduleLoader.moduleManager
		  , currentLoadedModule = moduleLoader.getCurrentLoadedModule();

		if(isEmptyModule(currentLoadedModule)) {
			moduleManager.error(modulePath);
			done(moduleManager.getCurrentStatus())
			throw console.error('$$namespace.include( moduleMethod ) : not exist moduleMethod to callback')
		}
		
		moduleManager.success(modulePath, currentLoadedModule);
		done(moduleManager.getCurrentStatus())
	}
	var NONE_DEPENDENCY_LOADED_MODULE = function noneDependencyModule() {};
	var EMPTY_MODULE = 'empty_module';
	var _currentLoadedModule = EMPTY_MODULE;
	var _isCalledSetCurrentLoadedModule = false;
	moduleLoader.setCurrentLoadedModule = function (loadedModule) {
		if(loadedModule == null) return loadedModule = NONE_DEPENDENCY_LOADED_MODULE;
		
		if(!(loadedModule instanceof Function) ) throw console.error('loadedModule must instance of Function');
		if(!isEmptyModule(_currentLoadedModule)) throw console.error('must be only one call about file ' + _currentLoadedModule);
		
		_isCalledSetCurrentLoadedModule = true;
		return _currentLoadedModule = loadedModule;
	};
	moduleLoader.getCurrentLoadedModule = function () {
		currentLoadedModule = _currentLoadedModule;
		_currentLoadedModule = EMPTY_MODULE;
		if(!_isCalledSetCurrentLoadedModule) currentLoadedModule = NONE_DEPENDENCY_LOADED_MODULE;
		_isCalledSetCurrentLoadedModule = false;
		return currentLoadedModule;
	}
	function isEmptyModule(loadedModule) {
		if(loadedModule == EMPTY_MODULE) return true
		else return false;
	}
	
	
	moduleLoader.$getScript = function (modulePath, dataMap, isAsync, dataType) {
		if(isAsync == null || isAsync == undefined) isAsync = true;
		var moduleManager = this.moduleManager
		  , path = this.path
		  , filePath = path.getFilePath(modulePath);
		
		moduleManager.start(modulePath);
        var promise = $.ajax({
				               'type': "GET"
				             , 'url': filePath
				             , 'data': dataMap
		//		            success: callback,
				             , 'async' : isAsync
				             , 'dataType': dataType || 'script'
				             , 'cache' : true //캐쉬..
		        	   });
        moduleManager.loading(modulePath);
        return promise;
	}
	function isExist(o) {
		if(o != null || o != undefined) return true;
		else return false;
	}
	
	
})();

}
	/////////////////////// moduleLoader
	
	/////////////////////// namespace
	function setNamespace(parentModule) {
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
		
	}
	/////////////////////// namespace
	
	///////////////////////////////////////// 하위 모듈 끝. //////////////////////////////////////
})();