/**
 * 
 */

var localFile = require('../common/localFile')
  , requestParser = require('./common/requestParser.js')
  , config = require('../config')
var file = module.exports = {
	mapUrlToResponse : function(app) {
		app.post('/file/download', this.downloadByClient);
	},
	downloadByClient : function(req, res) {
		var rawData = requestParser.getRawData(req);
		
		var fileName = rawData.fileName
		  , userId = rawData.userId
		  , filePath = config.imgDir + '/'+ userId + '/'+ fileName
		res.download(filePath);
	}
};