/*
 * passport를 내 설정에 맞게 초기화하는 책임. 
 * 초기화 된 passport exports되어 app에서 사용됨.
 * 
 *-1. 객체정의문   2. 초기화 실행문. 3. 주석
 */

var H = require('../helper.js')
  , U = require('../util/util.js')
  , _ = require('underscore')

var User = require('../../domain/User.js')
  , userDAO = require('../../dao/userDAO.js');
// ///////////////////////////////////////
//------------1. 정의
var CLASS = 'Class',
	PARAM = 'param';

var passport = require('passport');
var config = require('./oauth-config.js');
	// /////////////////////////////////
var oauthPassport = module.exports = {}

//passport lib 초기 설정 후 반환.
oauthPassport.setupAndGet = function() {
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
}
		//auth/linkedin(그리고 다른것) 요청의 콜백
		//1. user가 db에 이미 있는지 찾아보고 없으면 만듬.
		//2. next역할 : serializeUser에 전달
oauthPassport.authCallBack = function(accessToken, refreshToken, profile, next) {
	var userData = oauthPassport.profileToUserData(profile)
	  , loginUser = User.createBy(userData)
	
	H.call4promise(userDAO.findOrCreate, loginUser)
	 .then(function dataFn(user) {
		next(null, user) //serializeUser에 전달
    })
     .catch(next)
}
		
//		위치 : req.session.passport.user 
		//세션에 유저 저장 후 사용자 등록(user.goHome) 콜백을 수행
oauthPassport.serializeUser = function (user, next) {
	next(null, user);
}
	//세션에서 직렬화된 값을 가져올 때 사용. passport가 필요시 사용..
oauthPassport.deserializeUser = function (user, next) {
	// 세션에서 oauthId 가져옴
	next(null, user);
}
//passport로 소셜서비스에서 전달된 데이터를 아래 형식의 레코드로 반환해준다.
oauthPassport.profileToUserData = function (profile) {
	var userData = {};
	if(U.exist(profile.provider)) {
		userData._id = profile.id +'-' +  profile.provider;
//				userData.password = profile.password || profile.pw;
		userData.name =  profile.displayName || profile.name;
		userData.photo = profile.photo || profile._json.avatar_url || profile._json.picture || 
					 profile._json.pictureUrl || valueOfFirstOfList(profile.photos);
		if(profile.provider == 'facebook') userData.photo = profile._json.picture.data.url;
		
		userData.email = profile.email || valueOfFirstOfList(profile.emails);
	}
	return userData;
	
	function valueOfFirstOfList(list) {
		if(U.notExist(list)) return null;
		else return _.first(list).value || null; 
	};
}		

