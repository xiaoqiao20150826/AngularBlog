/**
 *  moduleLoader에서 사용될 경로변환.  
 *     (20140804)
 *   # 경로변환
 *    1) 로컬경로라면.
 *    
 *    2) 서버경로라면.
 */

(function(window) {
	var window = window
	  , location = window.location;
	if(location == null || location == undefined) throw new Error('window.location is not exist')
	
	var utilPackage = $$namespace.package('com.kang').package('util');
	
	//
	var path = utilPackage.export.path = {};
	
	
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
		
		path = this.trasformPostfix(path);
		
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
			name = this.trasformPostfix(name);
		return name;
	}
	// 다른 확장자 변환은 안되고 js만 확인해서 붙임.
	path.trasformPostfix = function (path) {
		if(path.lastIndexOf('.js') == -1) path = path + '.js';
		return path;
	};
	

	function removePostfix(path) {
		var lastIndex = path.lastIndexOf('/');
		return path.slice(0, lastIndex);
	}
	
	path.getDirPath = function (path) {
		if(isOnlyName(path)) return '/';
		
		var endIndex = path.lastIndexOf('/') +1
		  , dirpath = path.slice(0, endIndex);
		
		if(dirpath.charAt(0) != '/') return '/' + dirpath;
		else return dirpath;  
	}
	function isOnlyName(path) {
		if(path.lastIndexOf('/') == -1) return true;
		else return false;
	}
	
	path.getLocalDir = function () {
		var pathname = location.pathname;
		var last = pathname.lastIndexOf('/')
		return pathname.slice(1,last)
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
	
	
})(this)