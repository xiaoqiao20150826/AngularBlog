/**
 * 
 *  - 자바스크립트를 로드하여 현재 페이지로 불러온다.

 *  - 포함된 모듈. 
 *    path, moduleStatus 
 * 
 *  @param
 *   - modulePath : 서버는 절대경로, 로컬은 페이지의 상대경로
 *  
 */

//클로저변수 둘 필요.
var parentModule = this;
var window = this;

(function(parentModule, window) {
	if(!$) throw 'required closer variable $';
	
	// outer ref
	var moduleLoader = parentModule.moduleLoader = {};
	
	
	// inner ref
	moduleLoader.modules = {};
	moduleLoader.path = getPath(moduleLoader, window);
	moduleLoader.moduleStatus = getModuleStatus(moduleLoader);
//	moduleLoader.path = window.path					// 테스트용
//	moduleLoader.moduleStatus = window.moduleStatus // 테스트용
	// functions
	moduleLoader.load = function (done, path) {
		if(path instanceof Array) return this.loadMany(done, path);
		else return this.loadOne(done, path);
	};
	
//	//TODO: 이건 동기식호출이나 다름없어...그럴필요가없는데. 비효율적이야. 사용안할예정.
//	moduleLoader.loadMany = function(endDone, paths) {
//		if(paths.length < 1) throw console.error('paths must not empty');
//		
//		var loadOne = this.loadOne
//		  , curIndex = 0 
//		  , endIndex = paths.length-1;
//		
//		nextCall(null);
//		function nextCall(a, status) {
//			if(status=='error') throw console.error(a);
//			if(curIndex==endIndex) nextCall = endDone;
//			
//			var path = paths[curIndex++];
//			return loadOne(nextCall, path)
//		}
//	}
	// 비동기적으로 모두 로딩하고 완료시 endDone호출.
	moduleLoader.loadMany = function(endDone, modulePaths) {
		var moduleStatus= moduleLoader.moduleStatus;
		
		modulePaths.forEach(function (modulePath) {
			moduleLoader.loadOne(callEndDoneIfEnd, modulePath);
		});
		
		var callbackCount = 0;
		var modulePathCount = modulePaths.length;
		function callEndDoneIfEnd() {
			++callbackCount;
			if(modulePathCount == callbackCount) {
				var currentStatus = moduleStatus.currentStatus();
				return endDone(currentStatus);
				
			} else {return;}
		}
	} 
	moduleLoader.loadOne = function (done, modulePath) {
		if(modulePath ==null || modulePath == undefined) throw console.error('need a modulePath');
		var moduleStatus = moduleLoader.moduleStatus;
		
		moduleStatus.ready(modulePath);
		
		this.$getScript(modulePath)
			 .done(function() {
				 moduleStatus.success(modulePath);
				 done(moduleStatus.currentStatus())
			 })
			 .fail(function(o, status) {
				 if(status == 'error') {
					 moduleStatus.error(modulePath);
					 done(moduleStatus.currentStatus()); 
				 } else {
					 var errMessage = 'fail but not err status';
					 console.error(errMessage);
					 done(moduleStatus.currentStatus());
				 }
			 });
	};
	
	moduleLoader.$getScript = function (modulePath, data) {
		var url = this.path.parse(modulePath);
        var promise = $.ajax({
				            type: "GET",
				            url: url,
				            data: data,
		//		            success: callback,
				            dataType: 'script'
		        	   });
        self.moduleStatus.loading(modulePath);
        return promise;
	}
	moduleLoader.isAllSuccess = function () {return this.moduleStatus.isAllSuccess();}	
	moduleLoader.getModuleStatuses = function () { 	return this.moduleStatus.getModuleStatuses();}
	moduleLoader.getModulePaths = function () { return this.moduleStatus.getModulePaths(); }
	moduleLoader.currentStatus = function () { return this.moduleStatus.currentStatus(); }
	
//deprease
	moduleLoader.create$Script = function (path) {
		return $('<script>')
		.attr("type", "text/javascript")
		.attr("charset", "utf-8")
		.attr("src", path)
		.appendTo('body');
	}
	
	//////////////////////////////    moduleStatus
	var cachedModuleStatus;
	function getModuleStatus(moduleLoader) {
		var parentModule = moduleLoader;
		
		if(cachedModuleStatus) return cachedModuleStatus;
		
		return cachedModuleStatus = (function(parentModule) {
			
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
					if(this.isSuccess(moduleStatus) && currentStatus.status =='') {
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
			
	}// end  getModuleStatus
	
	//////////////////////////////    path	
	
	var cachedPath; 
	function getPath(moduleLoader, window) {
		var parentModule = moduleLoader
		  , window = window;
		
		if(cachedPath) return cachedPath;
		
		return cachedPath = (function(parentModule, window) {
			var location = window.location;
			if(location == null || location == undefined) throw new Error('window.location is not exist')
			//
			
			var path = parentModule.path = {};  //테스트를위해.. 외부에참조저장.
			
			
			path.parse = function  (path) {
				if(this.isLocal()) return this.getLocal(path);
				if(this.isServer()) return this.getServer(path);
				
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
			//sever
			path.getServer = function(path) {
				var char = path.charAt(0)
				
				if(isEmpty(path)) throw 'path not exist';
				if(isDot(char)) throw 'path should be abs path for server';
				
				if(char != '/') {path = '/' + path;}
				
				path = this.addExtensionJs(path);
				
				return path; 
			}
			//local
			path.getLocal= function (path) {
				var dir = this.mergeDir(path)
				  , name = this.getName(path);
				return dir+'/'+name;
			}
			path.mergeDir = function (path) {
				var name = this.getName(path); 
				var dirPath = this.getDirPath(path)
				  , localDir = this.getLocalDir()
				  , folderNames = dirPath.split('/')
				  , result = '';
				
				for(var i in folderNames) {
					var folderName = folderNames[i];
					
					if(isEmpty(folderName)) continue;
					if(isDot(folderName)) continue;
					
					if(isDoubleDot(folderName)) {
						localDir = removePostfix(localDir);
					} else { //그외 문자
						localDir = localDir + '/'+folderName;
					}
				}
				return localDir;
			}
			path.getName = function (path) {
				if(isOnlyName(path)) return path;
				
				var startIndex = path.lastIndexOf('/')
					name = path.slice(startIndex+1)
					name = this.addExtensionJs(name);
				return name;
			}
			// 다른 확장자 변환은 안되고 js만 확인해서 붙임.
			path.addExtensionJs = function (path) {
				if(!isExtension(path, '.js')) path = path + '.js';
				return path;
			};
			

			function removePostfix(path) {
				var lastIndex = path.lastIndexOf('/');
				return path.slice(0, lastIndex);
			}
			//원하는 만큼 일치하면 일치.
			path.equalPath = function(paths, pacakgePath) {
				var samePath = null;
				if(paths instanceof Array) 
					samePath = this.equalPathMany(paths, pacakgePath);
				else 
					samePath = this.equalPathOne(paths, pacakgePath);
				
				if(samePath.count == 0) throw new Error('not found path of : ' + pacakgePath);
				
				return samePath.path;
			}
			path.equalPathOne = function(path, pacakgePath) {
				return this.equalCountOne(path,pacakgePath);
			}
			path.equalPathMany = function(paths, pacakgePath) {
				var samePath = {count:0 , path:''};
				for(var i in paths) {
					var path = paths[i]
					var equalCount = this.equalCountOne(path, pacakgePath);
					if(samePath.count < equalCount.count)
						samePath = equalCount;
				}
				return samePath;
			}
			path.equalCountOne = function(path, pacakgePath) {
				var originPath = path;
				path = this.removeExtension(path.toLowerCase());
				path = path.split('/').reverse();
				pacakgePath = this.removeExtension(pacakgePath.toLowerCase());
				pacakgePath = pacakgePath.split('.').reverse();
				
				var minLength = (pacakgePath.length < path.length) ? pacakgePath.length : path.length; 
				
				var equalCount = 0; 
				for(var i = 0, max = minLength; i < max; ++i) {
					var pathPart = path[i]
					  , pacakgePathPart = pacakgePath[i];
					
					if(pathPart == pacakgePathPart) ++equalCount;
					else break;
				}
				return {path: originPath , count: equalCount};
			}
			
			path.removeExtension = function(path) {
				if(isExtension(path, '.js')) return path.slice(0, path.lastIndexOf('.js')); 
				else return path;
			}
			path.getDirPath = function (path) {
				if(isOnlyName(path)) return '/';
				
				var endIndex = path.lastIndexOf('/') +1
				  , dirpath = path.slice(0, endIndex);
				
				if(dirpath.charAt(0) != '/') return '/' + dirpath;
				else return dirpath;  
			}
			
			path.getLocalDir = function () {
				var pathname = location.pathname;
				var last = pathname.lastIndexOf('/')
				return pathname.slice(1,last)
			}
			function isExtension(path, extentionName) { // .js   .붙여야함
				var lastIndex = path.lastIndexOf('.');
				var extension = path.slice(lastIndex);
				if(extension == extentionName) return true;
				else return false;
			}
			function isOnlyName(path) {
				if(path.lastIndexOf('/') == -1) return true;
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
			
			
			
			return path;	
		})(parentModule, window) //path end
	}; //getPath end
	
	
	return moduleLoader;
})(parentModule, window);


//@ sourceURL=util/moduleLoader.js