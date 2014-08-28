/**
 * 
 */
var _ = require('underscore')
var config = require('../../config')

var pathUtil = module.exports = {}


pathUtil.getToAndFromFileUrl = function (fromFile, userId) {
	var imgDir =config.imgDir + '\\' + userId
	
	var fileName = fromFile.name
	  , fromFileUrl = fromFile.path //임시저장된 파일위치
	  , toFileUrl = imgDir + '\\' + fileName;
	  
	return {to : toFileUrl, from : fromFileUrl };
}

pathUtil.getFileName = function (filePath) {
	return filePath.slice(filePath.lastIndexOf('/')+1);
}
pathUtil.getLocalFilePath = function (userId, fileName) {
	return config.imgDir + '/'+ userId + '/'+ fileName
}
pathUtil.getUrlByLocalFilePath = function (localPath) {
	localPath = localPath.replace(/\\/g, '/')
	
	var url = localPath.slice(localPath.indexOf('/resource'))
	return url;
}
//   / 와 \\ 가 섞인주소가 만들어지는데 별문제는 없네.
pathUtil.getLocalFilePathByUrl = function (url) {
	if(_.isEmpty(url)) return null;
	
	return config.rootDir + url;
}