/**
 *  #역할
 *   - file의 create, delete를 로컬과 서버에 맞게 조절한다.
 */

var _ = require('underscore')
var H = require('../helper')
var config = require('../../config')

var Status = require('../Status.js')
var FileInfo = require('./FileInfo')
  , localFile = require('./localFile')
  , remoteFile = require('./remoteFile')
var fileDAO = module.exports = {}


//fileInfo를 반환해야함
fileDAO.save = function (done, fromFile, userId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	var originalFileName = fromFile.originalFilename
	  , fileName = originalFileName.slice(0,originalFileName.indexOf('.'))
	  , fromFilePath = fromFile.path
    
	var toFilePath = ''
	if(config.isLocal) {
		toFilePath = config.imgDir + '/' + userId + '/' + originalFileName  
		
		H.call4promise(localFile.copyNoDuplicate, fromFilePath, toFilePath, fromFile.type)
		 .then(function (status) {
			 if(status.isError()) return errFn(status)
			 
			 var insertedFilePath = status.filePath
			 var url = insertedFilePath.replace(/\\/g, '/')
			 url = 	url.slice(url.indexOf('/resource') )
			 
			 status.fileInfo = new FileInfo(insertedFilePath, fileName, url)
			 return dataFn(status)
		 })
		 .catch(function(err) {
			 return errFn(Status.makeError(err))
		 })
		
	} else { 
		toFilePath = userId + '/' + fileName	
		return remoteFile.save(done, fromFilePath, toFilePath, userId) 
	}
}

fileDAO.deleteByFileInfoes = function (done, fileInfoes) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	if(_.isEmpty(fileInfoes)) return dataFn(Status.makeSuccess('fileInfoes is empty'))
	
	var filePaths = []
	for(var i in fileInfoes) {
		var fileInfo = fileInfoes[i]
		
		if(H.notExist(fileInfo.id)) return errFn(Status.makeError('fileInfoes['+i +'] : '+ fileInfo +'] should have id field value'))
		filePaths.push(fileInfo.id) //id가 delete시 사용하는 path, or id
	}
	
	if(config.isLocal) {
		return H.call4promise(localFile.deleteFiles, filePaths)
		        .then(function (status) { return dataFn(status)})
		        .catch(function (err){ return Status.makeError(err)})
	} else {
		return H.call4promise(remoteFile.removeByIds, filePaths)
		        .then(function (status) { return dataFn(status)})
		        .catch(function (err){ return Status.makeError(err)})
	}
	
}

fileDAO.existFile = function _existFile(file) {
	if(file.size != 0 )
		return true;
	else
		return false;
} 