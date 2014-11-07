/**
 * 
 */
var _ = require('underscore')
var config = require('../../config')

var pathUtil = module.exports = {}

//없에
pathUtil.getToAndFromFileUrl = function (fromFile, userId) {
	var imgDir =config.imgDir + '/' + userId
	
	var fileName = fromFile.name
	  , fromFileUrl = fromFile.path //임시저장된 파일위치
	  , toFileUrl = imgDir + '/' + fileName;
	  
	return {to : toFileUrl, from : fromFileUrl };
}

pathUtil.getFileName = function (filePath) {
	return filePath.slice(filePath.lastIndexOf('/')+1);
}
//이것도
pathUtil.getLocalFilePath = function (userId, fileName) {
	return config.imgDir + '/'+ userId + '/'+ fileName
}

pathUtil.getUrlByLocalFilePath = function (localPath) {
	var localPath = localPath.replace(/\\/g, '/')
	
	var url = localPath.slice(localPath.indexOf('/resource'))
	return url;
}
//qjfuqjfu
//   / 와 \\ 가 섞인주소가 만들어지는데 별문제는 없네.
pathUtil.getLocalFilePathByUrl = function (urls) {
	if(_.isEmpty(urls)) return null;
	
	var filePaths = []
	var urls = _.compact(urls.split(';')) // 프론트엔드(insertController)에서 ;으로 구분하여 여러개 올수도.
	for(var i in urls) {
		var url = urls[i]
		filePaths.push(config.rootDir + url);
	}
	return filePaths;
}