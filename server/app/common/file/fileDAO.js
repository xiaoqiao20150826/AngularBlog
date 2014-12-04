/**
 *  #역할
 *   - file의 create, delete를 로컬과 서버에 맞게 조절한다.
 */
var Q = require('q')
var _ = require('underscore')
var H = require('../helper')
var config = require('../../config')

var Status = require('../Status.js')
var FileInfo = require('./FileInfo')
  , localFile = require('./localFile')
  , remoteFile = require('./remoteFile')
var fileDAO = module.exports = {}


//fileInfo를 반환해야함
fileDAO.save = function (fromFile, userId) {
	var originalFileName = fromFile.originalname
	  , fileName = originalFileName.slice(0,originalFileName.indexOf('.'))
	  , fromFilePath = fromFile.path
    

	var toFilePath = ''
	if(config.isLocal) {
		fromFilePath = fromFilePath.replace(/\\/g ,'/')
		toFilePath = config.imgDir + '/' + userId + '/' + originalFileName  
		
		return localFile.copyNoDuplicate( fromFilePath, toFilePath, fromFile.mimetype)
					 .then(function (status) {
						 if(status.isError()) return status
						 
						 var insertedFilePath = status.filePath
						 var url = insertedFilePath.replace(/\\/g, '/')
						 url = 	'/resource' + url.slice(url.indexOf('/static') )
						 
						 status.fileInfo = new FileInfo(insertedFilePath, fileName, url)
						 return status
					 })
		
	} else { 
		toFilePath = userId + '/' + fileName	
		return remoteFile.save(fromFilePath, toFilePath, userId) 
	}
}

fileDAO.deleteByFileInfoes = function (fileInfoes) {
	var deferred = Q.defer()
	
	if(_.isEmpty(fileInfoes)) return Q(Status.makeSuccess('fileInfoes is empty'));
	
	var filePaths = []
	for(var i in fileInfoes) {
		var fileInfo = fileInfoes[i]
		
		if(H.notExist(fileInfo.id)) return Q(Status.makeError('fileInfoes['+i +'] : '+ fileInfo +'] should have id field value'))
		filePaths.push(fileInfo.id) //id가 delete시 사용하는 path, or id
	}
	
	if(config.isLocal) {
		return localFile.deleteFiles( filePaths)
		        .then(function (status) { return deferred.resolve(status)})
		        .catch(function (err){ return deferred.resolve(Status.makeError(err)) })
	} else {
		return remoteFile.removeByIds( filePaths)
		        .then(function (status) { return deferred.resolve(status)})
		        .catch(function (err){ return deferred.resolve(Status.makeError(err))})
	}
	
	
	return deferred.promise
}

fileDAO.existFile = function _existFile(file) {
	if(file.size != 0 )
		return true;
	else
		return false;
} 