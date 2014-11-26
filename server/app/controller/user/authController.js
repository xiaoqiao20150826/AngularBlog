var _ = require('underscore');

var H = require('../../common/helper.js')
  , User = require('../../domain/User.js')
  , userDAO = require('../../dao/userDAO.js');

var JsonResponse  = require('../util/JsonResponse.js')
  , AuthRequest   = require('../util/AuthRequest.js')

  
// 차후확장..
var authController = module.exports = {};

authController.mapUrlToResponse = function(app) {
	var passport 	= app.get('passport');
	
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

	// json
	app.get('/json/auth/loginUserIsAdmin', this.loginUserIsAdmin)
	app.get('/json/auth/isLoginUser/:userId', this.isLoginUser) 
	
	//logout
	app.get('/logout', this.logout);
};
authController.loginUserIsAdmin = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req)
	var loginUser 	= authReq.getLoginUser()
	
	if(loginUser.isNotAdmin()) return jsonRes.sendFail('loginUser is not admin')
	
	return jsonRes.send({isAdmin : true});
}

//현재 로긴해있고 writerId(등의)일치를 판단.
authController.isLoginUser = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
		, authReq 	= new AuthRequest(req);
	var loginUser 	= authReq.getLoginUser()
		, rawData 	= authReq.getRawData(req)
		, userId 		= rawData.userId;
	
	if(loginUser.isEqualById(userId)) return jsonRes.sendFail(userId + ' is not loginUser')
	
	return jsonRes.send({isLoginUser : true});
}
//세션에 저장된 id를 이용해서 로그인 되었는지 체크한다.
authController.goHome = function (req, res) {
	res.redirect('/');
};
authController.logout = function(req, res){
	req.logout();
	res.redirect('/'); //Can fire before session is destroyed?
};


