/**
 *  
 *  - serverPath : ex) /abc/a.js     ../abc/a.js     ./abc/a.js
 *  - modulePath : the same example as above
 *  - localPath : C://abc/a.js
 *  
 */
var parentModule = window;
var window = window;

(function() {
	var location = window.location;
	if(location == null || location == undefined) throw new Error('window.location is not exist')
	//
	
	var path = parentModule.path = {};  //테스트를위해.. 외부에참조저장.
	
	
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
//@ sourceURL=util/path.js