/*
 *
 * 클래스화 시켜서 사용했어도 괜찮았을 것 같은데. 
 * 현재는 모듈스테이터스 객체들을 사용(관리)하는 단계까지 포함되어있다.
 */


var parentModule = this;

(function(parentModule) {
	
	var Status = {READY:'ready', START:'start', LOADING:'loading', SUCCESS:'success', ERROR:'error' }
	
	//
	var moduleStatus = parentModule.moduleStatus = {};
	
	
	moduleStatus.path = parentModule.path
	moduleStatus.moduleStatuses  = {};
	moduleStatus.modulePaths = [];
	//
	moduleStatus.ready = function (path) { this.saveModulePathAndStatus(path, Status.READY) };
	moduleStatus.start = function (path) { this.saveModulePathAndStatus(path, Status.START) }
	moduleStatus.loading = function (path) {this.saveModulePathAndStatus(path, Status.LOADING)};
	moduleStatus.success = function (path) {this.saveModulePathAndStatus(path, Status.SUCCESS) };
	moduleStatus.error = function (path) {this.saveModulePathAndStatus(path, Status.ERROR) };
	
	moduleStatus.saveModulePathAndStatus = function (path, status) {
		if(path instanceof Array) 
			return this.saveModulePathManyAndStatus(path, status);
		else 
			return this.saveModulePathOneAndStatus(path, status)
	}
	moduleStatus.saveModulePathManyAndStatus = function (paths, status) {
		for(var i in paths) {
			var path = paths[i];
			this.saveModulePathAndStatus(path, status)
		}
	}
	moduleStatus.saveModulePathOneAndStatus = function (path, status) {
		var modules =  this.moduleStatuses;
		if(beforeSave(modules[path])) {
			modules[path].status = status;
		}
		else {
			this.modulePaths.push(path);
			modules[path] = {path:path, status : status};
		}
	}
	function beforeSave(moduleStatus) {
		if(moduleStatus == null || moduleStatus == undefined) return false;
		else return true; 
	}
	
	
	moduleStatus.getModuleStatuses = function () { return this.moduleStatuses; 	}
	moduleStatus.getModulePaths = function () { return this.modulePaths;	}
	moduleStatus.getByPackagePath = function (packagePath) {
		var moduleStatuses =  this.moduleStatuses
		  , modulePaths = this.modulePaths
		  , modulePath = this.path.equalPath(modulePaths, packagePath)
		  , moduleStatus = moduleStatuses[modulePath];
		
		return moduleStatus;
	}
	moduleStatus.getModuleStatus = function (packagePath) {
		var moduleStatuses =  this.moduleStatuses
		  , modulePaths = this.modulePaths
		  , modulePath = this.path.equalPath(modulePaths, packagePath)
		  , moduleStatus = moduleStatuses[modulePath];
		
		return moduleStatus;
	}
	moduleStatus.getStatus = function (packagePath) {
		return this.getModuleStatus(packagePath).status;
	}
	moduleStatus.getPath = function (packagePath) {
		return this.getModuleStatus(packagePath).path;
	}
	//
	moduleStatus.currentStatus = function () {
		var currentStatus = {status:'', message:'', paths:[]};
		var moduleStatuses = this.moduleStatuses;
		
		for(var i in moduleStatuses) {
			var moduleStatus = moduleStatuses[i];
			if(this.isError(moduleStatus)) {
				currentStatus.status = Status.ERROR;
				currentStatus.paths.push(moduleStatus.path)
				currentStatus.message = 'error';
			}
			//제일마지막이어야함.
			if(this.isSuccess(moduleStatus) && currentStatus.status == '') {
				currentStatus.status = Status.SUCCESS;
				currentStatus.message = 'all success';
			} 
		}
		
		return currentStatus;
	}
	moduleStatus.isReady = function (status) { return isStatus(status, Status.READY);}
	moduleStatus.isStart = function (status) { return isStatus(status, Status.START);}
	moduleStatus.isLoading = function (status) { return isStatus(status, Status.LOADING);}
	moduleStatus.isError = function (status) { return isStatus(status, Status.ERROR);}
	moduleStatus.isSuccess = function (status) { return isStatus(status, Status.SUCCESS);}
	function isStatus(moduleStatus, statusType) {
		if(statusType == getStatus(moduleStatus)) return true;
		else return false;
	}
	function getStatus(moduleStatus) {
		if(moduleStatus instanceof String) return moduleStatus;
		else return moduleStatus.status
	}
	
	moduleStatus.removeAll = function () {
		this.moduleStatuses = {}
		this.modulePaths = []
	}
	
	return moduleStatus;	
})(parentModule)
//@ sourceURL=util/moduleStatus.js