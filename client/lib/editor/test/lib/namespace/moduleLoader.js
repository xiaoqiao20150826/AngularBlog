/**
 * 
 *  - 자바스크립트를 로드하여 현재 페이지로 불러온다.

 *  - 포함된 모듈. 
 *    path, moduleManager 
 * 
 *  @param
 *   - modulePath : 서버는 절대경로, 로컬은 페이지의 상대경로
 *  
 */

//클로저변수 둘 필요.
var parentModule = this
  , window = this
  , $ = $;

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
				            'type': "GET",
				            'url': filePath,
				            'data': dataMap,
		//		            success: callback,
				            'async' : isAsync,
				            'dataType': dataType || 'script'
		        	   });
        moduleManager.loading(modulePath);
        return promise;
	}
	function isExist(o) {
		if(o != null || o != undefined) return true;
		else return false;
	}
	
	
})();


//@ sourceURL=util/moduleLoader.js


