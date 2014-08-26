/**
 *  fs을 감싼 객체.
 */
var debug = require('debug')('nodeblog:commmon:localFile')
var _ = require('underscore')
  , path = require('path')
  , fs = require('fs');

var Status = require('../dao/util/Status') //이것이. 몽고디비를 위한건데. 여기서도 사용.
var H = require('./helper.js')
  , Done = H.Done;
  
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
//이건 전달하는 data없으니 내가 생성한 fileUrl을 전달함.
localFile.create = function(done, fileUrl, data) {
	done.hook4dataFn(function() {return fileUrl});
	var option = {encoding:'utf8'};
	fs.writeFile(fileUrl, data, option, done.getCallback());
}

localFile.createEx = function(done, fileUrl, data) {
	done.hook4dataFn(function() {return fileUrl});
	var dir = path.dirname(fileUrl)
	this.createFolderIfNotExist(dir, function () {
		localFile.create(done, fileUrl, data);
	});
}
localFile.read = function(done, fileUrl) {
	var option = {encoding:'utf8'};
	fs.readFile(fileUrl, option, done.getCallback());
}
localFile.copyNoThrow = function(done, fromFileUrl, toFileUrl) {
	var dataFn = done.getDataFn();
	done.setErrFn(function() {
		dataFn(null);
	})
	localFile.copy(done, fromFileUrl, toFileUrl)
}

localFile.copy = function(done, fromFileUrl, toFileUrl) {
	H.call4promise(localFile.read, fromFileUrl)
	 .then(function(data) {
//		 이미지를 읽을때 debug하면 무한반복됨. 이게 뭔일이냐.
//		 debug('read data :', data)
		 localFile.createEx(done, toFileUrl, data);
	 })
	 .catch(done.getErrFn());
}

localFile.copyNoDuplicate = function(done, fromFileUrl, toFileUrl) {
	var i = 0;
	
	loopUntilNoExistFile(toFileUrl);
	function loopUntilNoExistFile(to) {
		H.call4promise(localFile.exists, to)
		 .then(function (existFile) {
			 if(!existFile) { return localFile.copyNoThrow(done, fromFileUrl, to); }
			 else {
				 var newFileUrl = H.pushInMidOfStr(toFileUrl, (++i), '.');
				 return loopUntilNoExistFile(newFileUrl);
			 }
	     })
	     .catch(done.getErrFn());
	}
}
//이 함수는 err가 없어. data만 전달해 그래서 done의 async템플릿 사용은은 애매해.
localFile.exists = function(done, fileUrl) {
	fs.exists(fileUrl, done.getDataFn());
}

localFile.deleteFileAndDeleteFolderIfNotExistFile = function (done, filePath) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	if(_.isEmpty(filePath)) return dataFn();
    
	return H.call4promise(localFile.delete, filePath)
		    .then(function() {
			    return H.call4promise(localFile.deleteOneFolder, path.dirname(filePath)); 
	       })
	        .then(dataFn)
	        .catch(errFn)
}

localFile.delete = function(done, fileUrl) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	done.hook4dataFn(function () { return Status.makeSuccess('success.. no arg')})
	done.setErrFn(errFn4notFoundFile)  
	function errFn4notFoundFile(err) {
		if(err) {
			if (err.code == 'ENOENT')  
				return dataFn(Status.makeError('fail'));
			else 
				return errFn(err); 
		}
	}
	
	fs.unlink(fileUrl, done.getCallback());
}
localFile.deleteOneFolder = function(done, path) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	done.hook4dataFn(function () { return Status.makeSuccess('success.. no arg')})  
	done.setErrFn(errFn4existFile) 
	function errFn4existFile(err) {
		if(err) {
			if (err.code == 'EBUSY') return dataFn(Status.makeError('fail EBUSY'));
			if (err.code == 'ENOTEMPTY') return dataFn(Status.makeError('fail ENOTEMPTY'));
			
			return errFn(err); // 그외 
		}
	}  
	fs.rmdir(path, done.getCallback());
}

///
localFile.getToAndFromFileUrl = function _getToAndFromUrls(fromFile, imgDir) {
	var fileName = fromFile.name
	  , fromFileUrl = fromFile.path //임시저장된 파일위치
	  , toFileUrl = imgDir + '\\' + fileName;
	  
	return {to : toFileUrl, from : fromFileUrl };
}
localFile.existFile = function _existFile(file) {
	if(file.size != 0 )
		return true;
	else
		return false;
} 