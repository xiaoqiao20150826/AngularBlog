/*
 * passport를 내 설정에 맞게 초기화하는 책임. 
 * 초기화 된 passport exports되어 app에서 사용됨.
 * 
 *-1. 객체정의문   2. 초기화 실행문. 3. 주석
 */

var H = require('../helper.js')
  , Done = H.Done;

var User = require('../../domain/User.js')
  , reqParser = require('../../routes/common/reqParser.js')
  , userDAO = require('../../dao/userDAO.js');
// ///////////////////////////////////////
//------------1. 정의
var myPassport = (function() {
	var CLASS = 'Class',
		PARAM = 'param';
	
	var passport = require('passport');
	var config = require('./oauth-config.js');
	// /////////////////////////////////
	return {
		init : function() {
			//환경 설정
			for ( var key in config) {
				var aSocialConfig = config[key];
				var Class = aSocialConfig[CLASS];
				var param = aSocialConfig[PARAM];

				var aStrategy = new Class(param, this.authCallBack);
				passport.use(aStrategy);
			};
			//세션에서의 직렬/역직렬화 설정
			passport.serializeUser(this.serializeUser);
			passport.deserializeUser(this.deserializeUser);			
			return passport;			
		},
		//auth/linkedin/callback 요청의 콜백
		authCallBack : function(accessToken, refreshToken, profile, next) {
//			console.log('profile' + JSON.stringify(profile));
			var userInfo = reqParser.profileToUserInfo(profile);
			var loginUser = User.createBy(userInfo); 
			
			//1. user가 db에 이미 있는지 찾아보고 없으면 만듬.
			//2. next역할 : serializeUser에 전달
			var errFn = next
			userDAO.findOrCreateByUser(new Done(dataFn, errFn), loginUser);
			function dataFn(loginUser) {
				next(null, loginUser) //serializeUser에 전달
			}
		},
		
		//세션에 유저 저장 후 사용자 등록(user.goHome) 콜백을 수행
		serializeUser : function (loginUser, next) {
				next(null, loginUser);
		},
		//세션에서 직렬화된 값을 가져올 때 사용. passport가 필요시 사용..
		deserializeUser : function (loginUser, next) {
			// 세션에서 oauthId 가져옴
				next(null, loginUser);
		}
		
	};
})();

//----------------------------- 2.실행
module.exports = myPassport.init();
//------------------------------3. 주석
////////////////////////////////////////
// ----------------serializeUser, deserializeUser
//로그인 후 세션에 정보가 저장되면,로그인 상태를 유지하기 위해 클라이언트 쿠키에 그 세션의 식별자를 전달해야한다.
//그때 보안을위해 직접적 정보가 아닌 현재 세션의 유니크한 식별자를 전달하기 위해 아래 메서드사용.


// //////////////////////////////////////
// --------------verifyCallBack(accessToken, refreshToken, profile, done)
// passport가 요청에 대한 응답을 인증한후 (ex : passport.authenticate('twitter') )
// 파라미터로 아래의 콜백에 전달된다.
// # 콜백은 그 인증을 서버측에서 확인하는 용도이다(ex: db의 유저와 일치한지 확인 등)
// - 각 전략에 따라 전달되는 파라미터가 조금다름 (ex: localStrategy는 username, password, done )
// - done는 콜백의 확인이 성공,예외,실패 여부를 검증한 데이터와 함께 passport에 재전달한다.
// (ex: done(에러메시지 || null, user || false, {message:'실패이유'} || X);


