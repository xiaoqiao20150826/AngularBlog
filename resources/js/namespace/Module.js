/*
 *
 * 클래스화 시켜서 사용했어도 괜찮았을 것 같은데. 
 * 현재는 모듈스테이터스 객체들을 사용(관리)하는 단계까지 포함되어있다.
 */


var parentModule = this;

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
		moduleToRun.call(this, this.exports, this.require);
		
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
		var message = this.status + ' ';
		if(this.message) message = message + ' ' + this.message + '| ';
		
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
//@ sourceURL=util/Module.js