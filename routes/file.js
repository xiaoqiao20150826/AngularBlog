/**
 * 
 */

var localFile = require('../common/localFile');

var file = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/file/download', this.downloadByClient);
	},
	downloadByClient : function(req, res) {
		var filepath = req.query.filepath;
		res.download(filepath);
	}
};