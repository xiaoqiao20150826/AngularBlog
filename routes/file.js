/**
 * 
 */

var fsHelper = require('../common/fsHelper');

var file = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/file/download', this.downloadByClient);
	},
	downloadByClient : function(req, res) {
		var filepath = req.query.filepath;
		console.log(filepath);
		res.download(filepath);
	}
};