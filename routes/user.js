/*
 * GET users listing.
 */

var _ = require('underscore');

var H = require('../common/helper.js')
  , requestParser = require('./common/requestParser.js')

var user = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/user/:userId', this.userView);// 스트링이야. 주의
	},
	userView : function (req, res) {
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , userId = rawData.userId;
		
		if(loginUser.isNotExist() || loginUser.isNotEqualById(userId)) return _redirectMain(res);
		
		var blog = {loginUser : loginUser}; 
		res.render('./user/userLayout.ejs',{blog : blog});
	}
	
////////////////////////////

};

function _redirectMain(res) {
	res.redirect('/');
} 
