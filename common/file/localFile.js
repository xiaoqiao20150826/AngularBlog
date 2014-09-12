/**
 *  fs을 감싼 객체.
 */
var debug = require('debug')('nodeblog:commmon:localFile')
var _ = require('underscore')
  , path = require('path')
  , fs = require('fs');

var Status = require('../Status') //이것이. 몽고디비를 위한건데. 여기서도 사용.
var H = require('../helper.js')
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
//이건 전달하는 data없으니 내가 생성한 filePath을 전달함.
localFile.create = function(done, filePath, data, option) {
	done.hook4dataFn(function(data) {
		var status = Status.makeSuccess(data)
		status.filePath = filePath
		return status 
	});
	
	var option = option || {encoding:'utf8'};
	fs.writeFile(filePath, data, option, done.getCallback());
}

localFile.createEx = function(done, filePath, data, option) {
	done.hook4dataFn(function(data) {
		var status = Status.makeSuccess(data)
		status.filePath = filePath
		return status 
	});
	
	var dir = path.dirname(filePath)
	localFile.createFolderIfNotExist(dir, function () {
		localFile.create(done, filePath, data, option);
	});
}
localFile.read = function(done, filePath, option) {
	var option = option || {encoding:'utf8'}
	fs.readFile(filePath, option, done.getCallback());
}
localFile.copyNoThrow = function(done, fromFileUrl, toFileUrl, option) {
	var dataFn = done.getDataFn();
	done.setErrFn(function(err) {
		debug('copyNoThrow err', err)
		dataFn(Status.makeError(err));
		
	})
	localFile.copy(done, fromFileUrl, toFileUrl, option)
}

localFile.copy = function(done, fromFileUrl, toFileUrl, option) {
	var dataFn = done.getDataFn();
	H.call4promise(localFile.read, fromFileUrl, option)
	 .then(function(data) {
//		 이미지를 읽을때 debug하면 무한반복됨. 이게 뭔일이냐.
//		 debug('read data :', data)
		 debug('fromFileUrl and data is exist', fromFileUrl  )
		 if(H.notExist(data)) 
			 return Status.makeError(fromFileUrl + ' data is not exist')
		 else 
			 return localFile.createEx(done, toFileUrl, data, option);
	 })
	 .catch(done.getErrFn());
}

localFile.copyNoDuplicate = function(done, fromFileUrl, toFileUrl, type) {
	var option = null;
	if(localFile.isImageType(type)) { option = {encoding:'binary'} }
	
	return localFile.copyNoDuplicateWithOption(done, fromFileUrl, toFileUrl, option)
}
localFile.copyNoDuplicateWithOption = function(done, fromFileUrl, toFileUrl, option) {
	var i = 0;
	
	loopUntilNoExistFile(toFileUrl);
	function loopUntilNoExistFile(to) {
		H.call4promise(localFile.exists, to)
		 .then(function (existFile) {
			 if(!existFile) { return localFile.copyNoThrow(done, fromFileUrl, to, option); }
			 else {
				 var newFileUrl = H.pushInMidOfStr(toFileUrl, (++i), '.');
				 return loopUntilNoExistFile(newFileUrl);
			 }
	     })
	     .catch(done.getErrFn());
	}
}
//이 함수는 err가 없어. data만 전달해 그래서 done의 async템플릿 사용은은 애매해.
localFile.exists = function(done, filePath) {
	fs.exists(filePath, done.getDataFn());
}

//하나짜리 사용안할듯.
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

//
localFile.deleteFiles = function (lastDone, filePaths) {
	var lastDataFn = lastDone.getDataFn()
	  , lastErrFn = lastDone.getErrFn()
	
	var doneAfterLoop = new Done(dataFn, errFn)  
	H.asyncLoop(filePaths , localFile.delete, doneAfterLoop)
	
	function dataFn(statues) {
		debug('deleteFiles statues : ', statues)
		return lastDataFn(Status.makeSuccess('file delete success'))
	}
	function errFn(err) {
		return lastErrFn(Status.makeError(err))
	}
}
localFile.delete = function(done, filePath) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	done.hook4dataFn(function(data) { return Status.makeSuccess(data) });
	done.setErrFn(errFn4notFoundFile)  
	function errFn4notFoundFile(err) {
		if(err) {
			//없는경우 성공으로 넘기면됨.
			if (err.code == 'ENOENT')  return dataFn(Status.makeSuccess(''));
			
			return errFn(err); 
		}
	}
	
	fs.unlink(filePath, done.getCallback());
}
localFile.deleteOneFolder = function(done, path) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	done.hook4dataFn(function(data) { return Status.makeSuccess(data) });
	done.setErrFn(errFn4existFile) 
	function errFn4existFile(err) {
		if(err) {
			//파일존재시 삭제하지 안을것이니.. 성공으로.
			if (err.code == 'EBUSY') return dataFn(Status.makeSuccess('fail EBUSY'));
			if (err.code == 'ENOTEMPTY') return dataFn(Status.makeSuccess('fail ENOTEMPTY'));
			
			return errFn(err); // 그외 
		}
	}  
	fs.rmdir(path, done.getCallback());
}

///
//TODO: 이게 애매하네. 이미지(png등..) 타입인지를 다 확인해야함?
localFile.isImageType = function (type) {
	if(!type) return false;
	
	if(type.indexOf('image/jpeg') != -1) return true;
	else return false;
}