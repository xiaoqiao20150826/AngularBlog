/**
 *  fs을 감싼 객체.
 */
var debug = require('debug')('nodeblog:commmon:localFile')

var Q = require('q')
var _ = require('underscore')
  , path = require('path')
  , fs = require('fs');

var Status = require('../Status') //이것이. 몽고디비를 위한건데. 여기서도 사용.
var H = require('../helper.js')

var iconv = require('iconv-lite')
/////
var localFile = module.exports = {};

// 
// call4promise 같은 기교를 부릴 수 없다. done을 사용하지 않는 함수.
// nextFn(undefined){} : call nextFn after this createFolderIfNotExist is end
localFile.createFolderIfNotExist = function (dirPath, nextFn) {
	var mode = '0777'; //default
	createDir(dirPath);
	
	var dirsToCreate = [];
	function createDir(dirPath) {
		fs.mkdir(dirPath, mode, createDirIfExistErr);
		function createDirIfExistErr(err) { //data는 성공해도 undefined
			if(!err) { //create success
				if(_.isEmpty(dirsToCreate)) return nextFn();
				else return createDir(dirsToCreate.pop());
			}
			if(err && err.code == 'EEXIST') {
				if(_.isEmpty(dirsToCreate)) return nextFn();
				else return ;
			}
			if(err && err.code == 'ENOENT') {
				dirsToCreate.push(dirPath);
				return createDir(path.dirname(dirPath));
			}
		}
	}
};

//			fild 관련

//callback(err)로 호출되기에 data는 값이 없지만 dataFn을 통해 다음행동을 할 수 있다.
//이건 전달하는 data없으니 내가 생성한 filePath을 전달함.
localFile.create = function(filePath, data, option) {
	var deferred = Q.defer()
	  , callback = H.cb4mongo1(deferred)
	
	var option = option || {encoding:'utf8'};
	fs.writeFile(filePath, data, option, callback)
	
	return deferred.promise.then(function(data) {
		var status = Status.makeSuccess(data)
		status.filePath = filePath
		return status 
	});
}

localFile.createEx = function(filePath, data, option) {
	var deferred = Q.defer()
	
	var dir = path.dirname(filePath)
	
	localFile.createFolderIfNotExist(dir, function done() {
		localFile.create(filePath, data, option)
				 .then(function(data) {
						var status = Status.makeSuccess(data)
						status.filePath = filePath
						deferred.resolve(status) 
					})
	});
	
	return deferred.promise
}
localFile.read = function(filePath, option) {
	var deferred = Q.defer()
	  , callback = H.cb4mongo1(deferred)
	
	var option = option || {encoding:'utf8'}
	
	fs.readFile(filePath, option, callback);
	
	return deferred.promise;
}
//한글로 읽기 , binary로 읽고, 버퍼에 담고, euc-kr로 디코드
localFile.readKr = function(filePath) {
	var option = option || {encoding:'binary'}
	
	return localFile.read(filePath, option)
					.then(function(data) {
						 var buf = new Buffer(data, 'binary');
						 return iconv.decode(buf, 'euc-kr')
					})
}
localFile.copyNoThrow = function(fromFileUrl, toFileUrl, option) {
	var deferred = Q.defer()
	
	localFile.copy(fromFileUrl, toFileUrl, option)
			 .then(function(status) { deferred.resolve(status) })
			 .catch(function(err) {
				 debug('copyNoThrow err', err)
				 deferred.resolve(Status.makeError(err)) 
			 })
	
	return deferred.promise;
}

localFile.copy = function(fromFileUrl, toFileUrl, option) {
	return localFile.read( fromFileUrl, option)
			 		 .then(function(data) {
				//		 이미지를 읽을때 debug하면 무한반복됨. 이게 뭔일이냐.
				//		 debug('read data :', data)
						 debug('fromFileUrl and data is exist', fromFileUrl  )
						 if(H.notExist(data)) 
							 return Status.makeError(fromFileUrl + ' data is not exist')
						 else 
							 return localFile.createEx(toFileUrl, data, option);
					 })
}

localFile.copyNoDuplicate = function(fromFileUrl, toFileUrl, type) {
	var option = null;
	if(localFile.isImageType(type)) { option = {encoding:'binary'} }
	
	return localFile.copyNoDuplicateWithOption(fromFileUrl, toFileUrl, option)
}
//TODO : 재귀랑 promise 짬뽕하니 좀 이상한데.?
localFile.copyNoDuplicateWithOption = function(fromFileUrl, toFileUrl, option) {
	var i = 0;
	
	return loopUntilNoExistFile(toFileUrl);
	
	function loopUntilNoExistFile(to) {
		return localFile.exists(to)
				 .then(function (existFile) {
					 if(!existFile) { return localFile.copyNoThrow(fromFileUrl, to, option); }
					 else {
						 var newFileUrl = H.pushInMidOfStr(toFileUrl, (++i), '.');
						 return loopUntilNoExistFile(newFileUrl);
					 }
			     })
	}
}
//이 함수는 err가 없어. data만 전달해 그래서 done의 async템플릿 사용은은 애매해.
localFile.exists = function(filePath) {
	var deferred = Q.defer()
	
	fs.exists(filePath, function(data) {
		deferred.resolve(data)
	});
	
	return deferred.promise
}

//하나짜리 사용안할듯.
localFile.deleteFileAndDeleteFolderIfNotExistFile = function ( filePath) {
	
	if(_.isEmpty(filePath)) return Q();
    
	return localFile.delete( filePath)
				    .then(function() {
					    return localFile.deleteOneFolder( path.dirname(filePath)); 
			       })
}

//
localFile.deleteFiles = function (filePaths) {
	var deferred = Q.defer()
	
	var statuses = []
	_.reduce(filePaths, function(p, filePath){
		return p.then(function(){return localFile.delete(filePath)})
		 	    .then(function(status){ statuses.push(status)})
	},Q())
	.then(function() {
		deferred.resolve(Status.reduceOne(statuses))
	})
	.catch(function (err) {
		deferred.resolve(Status.makeError(err))
	})
	
	return deferred.promise;
}

localFile.delete = function(filePath) {
	var deferred = Q.defer()
	
	fs.unlink(filePath, function(err, data) {
		if(err) {
			  // 없는경우
			  if (err.code == 'ENOENT') return deferred.resolve(Status.makeSuccess('enoent'))
			  else return deferred.resolve(Status.makeError(err))			
		}
		
		return deferred.resolve(Status.makeSuccess(data))
	})
	
	return deferred.promise
}
localFile.deleteOneFolder = function(path) {
	var deferred = Q.defer()
	
	fs.rmdir(path, function(err, data){
		if(err) {
			//폴더제거할떄 파일존재시 삭제하지 않을것이니.. 성공으로.
			if (err.code == 'EBUSY') return deferred.resolve(Status.makeSuccess('fail EBUSY'));
			if (err.code == 'ENOTEMPTY') return deferred.resolve(Status.makeSuccess('fail ENOTEMPTY'));
			
			return deferred.reject(err)			
		}
		
		return deferred.resolve(Status.makeSuccess(data)) 
	});
	
	return deferred.promise
}
//기타
localFile.stat = function(filePath) {
	var deferred = Q.defer()
	  , callback = H.cb4mongo1(deferred)
	
	//atime : 접근날짜, ctime: create날짜, mtime: 수정한날짜.
	fs.stat(filePath, callback);
	
	return deferred.promise
}

// 이건 신기하게 한글도 읽어주고.. 띄워쓰기도 구분하고. 
localFile.fileNamesInFolder = function(dirPath) {
	var deferred = Q.defer()
	  , callback = H.cb4mongo1(deferred)
	
	fs.readdir(dirPath, callback);
	
	return deferred.promise
}

///
//TODO: 이게 애매하네. 이미지(png등..) 타입인지를 다 확인해야함?
localFile.isImageType = function (type) {
	if(!type) return false;
	
	if(type.indexOf('image/jpeg') != -1) return true;
	else return false;
}