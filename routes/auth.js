var User = require('../model/user.js');

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
		app.get('/auth/google',passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
		app.get('/auth/google/callback', passport.authenticate('google'), this.commonCallBack);
		//linkedin
		app.get('/auth/linkedin',passport.authenticate('linkedin'));
		app.get('/auth/linkedin/callback', passport.authenticate('linkedin'), this.commonCallBack);
	},
	commonCallBack : function (req, res) {
			  var oauthID = req.session.passport.user;
			  console.debug('oauthID(userId)_inSession : '+ oauthID);
			  User.findById(oauthID, function(err, user) {
				    if(err) { 
				      console.log(err); 
				    } else {
				      res.send(user);
				    }
			  });
	}
////////////////////////////
//더 커지면 분리하자.
};

