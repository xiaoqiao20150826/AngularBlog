var _ = require('underscore');

var H = require('../common/helper.js')
  , Done = H.Done
  , User = require('../domain/User.js')
  , userDAO = require('../dao/userDAO.js');

// 차후확장..
var auth = module.exports = {};

auth.mapUrlToResponse = function(app) {
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
auth.goHome = function (req, res) {
	res.redirect('/');
};
auth.logout = function(req, res){
	  req.logout();
	  res.redirect('/'); //Can fire before session is destroyed?
	};
//auth.goHome = function (req, res) {
//	console.log('session ',JSON.stringify(req.session))
//	var id = req.session.passport.user;
//	userDAO.findById(new Done(dataFn), id);
//	function dataFn(user) {
//		res.send(user) 
//	}
//};

//db에 저장된 사용자의 로그인 기능. 사용하지 않을 예정.
//auth.signinUser = function (req, res) {
//	var body = req.body;
//	// 리다이렉트? 혹은 다시 입력하시오..하면서 그러니까 ajax네
//	if(_.isEmpty(req.body)) res.send('클라이언트에서 데이터를 제대로 전송 못함.'); 
//	
//	var email = req.body.email
//	  , password = req.body.password
//	  , rawData = {_id : body.email, password: body.password }
//	  , loginUser = User.createBy(rawData);
//	
//	userDAO.findByUser(new H.Done(dataFn), loginUser);
//	function dataFn(user) {
//		res.send(user);
////			if(!(user instanceof User)) {}
//		console.log(user);
//	};
//};
	
