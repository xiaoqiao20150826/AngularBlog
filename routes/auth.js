var userDAO = require('../dao/userDAO.js');

// 차후확장..
var auth = module.exports = {
	mapUrlToResponse : function(app) {
		var passport = app.get('passport');
		//facebook
		app.get('/auth/facebook',passport.authenticate('facebook'));
		app.get('/auth/facebook/callback', passport.authenticate('facebook'), this.commonCallBack);
		//twitter
		app.get('/auth/twitter',passport.authenticate('twitter'));
		app.get('/auth/twitter/callback', passport.authenticate('twitter'), this.commonCallBack);
		//github
		app.get('/auth/github',passport.authenticate('github'));
		app.get('/auth/github/callback', passport.authenticate('github'), this.commonCallBack);
		//google
		app.get('/auth/google',passport.authenticate('google'));
		app.get('/auth/google/callback', passport.authenticate('google'), this.commonCallBack);
		//linkedin
		app.get('/auth/linkedin',passport.authenticate('linkedin',{ state: 'SOME STATE' }));
		app.get('/auth/linkedin/callback', passport.authenticate('linkedin'), this.commonCallBack);
	},
	commonCallBack : function (req, res) {
			  var oauthID = req.session.passport.user;
			  console.log('oauthId_inSession : '+ oauthID);
			  userDAO.findById(oauthID, function(err, userData) {
				      res.send(userData);
			  });
	}
////////////////////////////
//더 커지면 분리하자.
};

