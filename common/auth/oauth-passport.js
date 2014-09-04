/*
 * passport를 내 설정에 맞게 초기화하는 책임. 
 * 초기화 된 passport exports되어 app에서 사용됨.
 * 
 *-1. 객체정의문   2. 초기화 실행문. 3. 주석
 */

var H = require('../helper.js')
  , Done = H.Done;

var User = require('../../domain/User.js')
  , requestParser = require('../../controller/util/requestParser.js')
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
		//auth/linkedin(그리고 다른것) 요청의 콜백
		//1. user가 db에 이미 있는지 찾아보고 없으면 만듬.
		//2. next역할 : serializeUser에 전달
		authCallBack : function(accessToken, refreshToken, profile, next) {
			var userInfo = requestParser.profileToUserInfo(profile)
			  , loginUser = User.createBy(userInfo)
			
			H.call4promise(userDAO.findOrCreate, loginUser)
			 .then(function dataFn(user) {
				next(null, user) //serializeUser에 전달
		    })
		     .catch(next)
		},
		
		//세션에 유저 저장 후 사용자 등록(user.goHome) 콜백을 수행
		serializeUser : function (user, next) {
				next(null, user);
		},
		//세션에서 직렬화된 값을 가져올 때 사용. passport가 필요시 사용..
		deserializeUser : function (user, next) {
			// 세션에서 oauthId 가져옴
				next(null, user);
		}
		
	};
})();

//----------------------------- 2.실행
module.exports = myPassport.init();
