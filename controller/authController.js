var _ = require('underscore');

var H = require('../common/helper.js')
  , Done = H.Done
  , User = require('../domain/User.js')
  , userDAO = require('../dao/userDAO.js');

// 차후확장..
var authController = module.exports = {};

authController.mapUrlToResponse = function(app) {
	var passport = app.get('passport');
	//저장된 user
//	app.post('/signin', this.signinUser)
	
	//facebook
	app.get('/auth/facebook',passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook'), this.goHome);
	//twitter
	app.get('/auth/twitter',passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter'), this.goHome);
	//github
	app.get('/auth/github',passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github'), this.goHome);
	//google
	app.get('/auth/google',passport.authenticate('google'));
	app.get('/auth/google/callback', passport.authenticate('google'), this.goHome);
	//linkedin
	app.get('/auth/linkedin',passport.authenticate('linkedin',{ state: 'SOME STATE' }));
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin'), this.goHome);
	
	//logout
	app.get('/logout', this.logout);
};
//세션에 저장된 id를 이용해서 로그인 되었는지 체크한다.
authController.goHome = function (req, res) {
	res.redirect('/');
};
authController.logout = function(req, res){
	  req.logout();
	  res.redirect('/'); //Can fire before session is destroyed?
	};
