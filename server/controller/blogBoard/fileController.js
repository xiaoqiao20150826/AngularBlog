/**
 * 
 */
var config = require('../../config')
var debug = require('debug')('nodeblog:controller:file')
  , _ = require('underscore')
  
var H = require('../../common/helper')
  
var fileDAO = require('../../common/file/fileDAO')
  , requestParser = require('../util/requestParser.js')
  , Redirector = require('../util/Redirector.js')
  
//download는 앵커로 간단히 해결  
var fileController = module.exports = {
	mapUrlToResponse : function(app) {
		app.post('/file/upload', this.uploadByClient);
	},
	uploadByClient : function(req, res) {
 		var redirector = new Redirector(res)
		var rawData = requestParser.getRawData(req)
		  , loginUser = requestParser.getLoginUser(req)
		  , userId = loginUser._id
		  , fromFile = _.first(_.toArray(req.files))//TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감
		
 		if(!fileDAO.existFile(fromFile)) return dataFn('error : file size is '+ fromFile.size);
 		//file저장 및 업데이트.
		H.call4promise(fileDAO.save, fromFile, userId)
		 .then(function(status) {
			 debug('status after file save : ', status)
			 
			 res.send(status.toJsonString())
		 })
		 .catch(redirector.catch);
	}
};