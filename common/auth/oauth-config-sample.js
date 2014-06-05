//1. 파일이름을 oauth-config.js 로 변경한다.
//2. 각 소셜서비스의 clientID(consumerKey), clientSecret(consumerSecret)을 적절하게 변경한다.

var oauthConfig = {
	facebook : {
		Class : require('passport-facebook').Strategy,
		param : {
			clientID : 'clientID',
			clientSecret : 'clientSecret',
			callbackURL : "http://nodeblog.com:3000/auth/facebook/callback",
			scope : ['read_stream', 'email'] ,
			profileFields : ['id', 'displayName', 'gender', 'photos', 'emails']  
		}
	},
	twitter : { //트위터는 이메일 정보는 제공하지 않는다고 한다.
		Class : require('passport-twitter').Strategy,
		param : {
			consumerKey : 'consumerKey',
			consumerSecret : 'consumerSecret',
			callbackURL : "http://nodeblog.com:3000/auth/twitter/callback",
		}
	},
	github : {
		Class : require('passport-github').Strategy,
		param : {
			clientID : 'clientID',
			clientSecret : 'clientSecret',
			callbackURL : "http://nodeblog.com:3000/auth/github/callback",
			scope : 'user'
		}
	},
	google : {
		Class : require('passport-google-oauth').OAuth2Strategy,
		param : {
			clientID: 'clientID',
		    clientSecret: 'clientSecret',
		    callbackURL : 'http://nodeblog.com:3000/auth/google/callback',
		    scope : [
		             'https://www.googleapis.com/auth/userinfo.profile',
		             'https://www.googleapis.com/auth/userinfo.email'
		           ]
		}
	},
	linkedin : {
		Class : require('passport-linkedin-oauth2').Strategy,
		param : {
			clientID: 'clientID',
		    clientSecret: 'clientSecret',
		    callbackURL: "http://nodeblog.com:3000/auth/linkedin/callback",
		    scope: ['r_emailaddress', 'r_basicprofile']
		}
	}
};

module.exports = oauthConfig;