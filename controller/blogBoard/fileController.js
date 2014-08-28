/**
 * 
 */
var debug = require('debug')('nodeblog:controller:fileController')
  , _ = require('underscore')
  
var H = require('../../common/helper')
  , pathUtil = require('../../common/util/pathUtil')
  
var localFile = require('../../common/localFile')
  , requestParser = require('../util/requestParser.js')
  , Redirector = require('../util/Redirector.js')
  
  
var fileController = module.exports = {
	mapUrlToResponse : function(app) {
		app.post('/file/download', this.downloadByClient);
		app.post('/file/upload', this.uploadByClient);
	},
	downloadByClient : function(req, res) {
		var rawData = requestParser.getRawData(req);
		
		var fileName = rawData.fileName
		  , userId = rawData.userId
		  , filePath = pathUtil.getLocalFilePath(userId, fileName)
		res.download(filePath);
	},
	uploadByClient : function(req, res) {
 		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		  , userId = rawData.userId
		  , file = _.first(_.toArray(req.files))//TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감
 		  , type = file.type
		
 		debug('userId ',userId)
 		if(!localFile.existFile(file)) return dataFn(null);
 		//file저장 및 업데이트.
 		var urls = pathUtil.getToAndFromFileUrl(file, userId);
 		
		H.call4promise(localFile.copyNoDuplicate, urls.from , urls.to, type)
		 .then(function(savedFileUrl) {
			debug('saved file url : ', savedFileUrl)
			var imgUrl = pathUtil.getUrlByLocalFilePath(savedFileUrl) 
			dataFn(imgUrl)
		 })
		 .catch(dataFn);
		
		function dataFn(url) {
			res.send(url);
		}
	}
};