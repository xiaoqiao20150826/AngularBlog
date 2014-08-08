/**
 *  moduleLoader에서 사용될 경로변환.  
 *     (20140804)
 *   # 경로변환
 *    1) 로컬경로라면.
 *    
 *    2) 서버경로라면.
 */
var parentModule = window;

(function(parentModule, window) {
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
		var paths = path.split('/').reverse();
		pacakgePath = this.removeExtension(pacakgePath.toLowerCase());
		var pacakgePaths = pacakgePath.split('.').reverse();
		
		var minLength = (pacakgePaths.length < paths.length) ? pacakgePaths.length : paths.length; 
		
		var equalCount = 0;
		for(var i = 0, max = minLength; i < max; ++i) {
			var pathPart = paths[i]
			  , pacakgePathPart = pacakgePaths[i];
			
			if(pathPart == pacakgePathPart) ++equalCount;
			else break;
		}
		return {path: originPath , count: equalCount};
	}
//	firstPathMustEqual()
	
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
})(parentModule, window)
//@ sourceURL=util/path.js