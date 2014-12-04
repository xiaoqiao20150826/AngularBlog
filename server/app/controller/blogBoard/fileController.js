/**
 * 
 */
var config = require('../../config')
var debug = require('debug')('nodeblog:controller:file')
  , _ = require('underscore')
  
var H = require('../../common/helper')
  
var fileDAO 	  = require('../../common/file/fileDAO')
var JsonResponse  = require('../util/JsonResponse.js')
  , AuthRequest   = require('../util/AuthRequest.js');
  
//download는 앵커로 간단히 해결? 변경되서 확인해봐야 앎.  
var fileController = module.exports = {
	mapUrlToResponse : function(app) {
		app.post('/file/upload', this.uploadByClient);
	},
	
	uploadByClient : function(req, res) {
		var jsonRes 	= new JsonResponse(res)
		  , authReq 	= new AuthRequest(req);
		
		var loginUser 	= authReq.getLoginUser(req)
		var rawData 	= authReq.getRawData(req)
		  , userId 		= loginUser._id
		  , fromFile 	= _.first(_.toArray(req.files))//TODO: 현재하나뿐. 파일업로드 안해도 빈거들어감
		
 		if(!fileDAO.existFile(fromFile)) return jsonRes.sendFail('error : file size is '+ fromFile.size);
		
 		//file저장 및 업데이트.
		fileDAO.save(fromFile, userId)
		 .then(function(status) {
			 debug('status after file save : ', status)
			 if(status.isError && status.isError()) return jsonRes.sendFail(status)
			 
			 else return jsonRes.send(status.fileInfo)
		 })
		 .catch(jsonRes.catch())
	}
};