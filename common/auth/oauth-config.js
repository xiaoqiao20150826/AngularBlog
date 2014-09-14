var config = require('../../config')
  , passportConfig = config.passport
  
var oauthConfig = module.exports = {
	facebook : {
		Class : require('passport-facebook').Strategy,
		param : {
			clientID : passportConfig.facebook.id,
			clientSecret : passportConfig.facebook.secret,
			callbackURL : config.host + "/auth/facebook/callback",
			scope : ['read_stream', 'email'] ,
			profileFields : ['id', 'displayName', 'gender', 'photos', 'emails']  
		}
	},
	twitter : { //트위터는 이메일 정보는 제공하지 않는다고 한다.
		Class : require('passport-twitter').Strategy,
		param : {
			consumerKey : passportConfig.twitter.id,
			consumerSecret : passportConfig.twitter.secret,
			callbackURL : config.host + "/auth/twitter/callback",
		}
	},
	github : {
		Class : require('passport-github').Strategy,
		param : {
			clientID : passportConfig.github.id,
			clientSecret : passportConfig.github.secret,
			callbackURL : config.host + "/auth/github/callback",
			scope : 'user:email'
		}
	},
	google : {
		Class : require('passport-google-oauth').OAuth2Strategy,
		param : {
			clientID: passportConfig.google.id,
		    clientSecret: passportConfig.google.secret,
		    callbackURL : config.host + "/auth/google/callback",
		    scope : [
		             'https://www.googleapis.com/auth/userinfo.profile',
		             'https://www.googleapis.com/auth/userinfo.email'
		           ]
		}
	},
	linkedin : {
		Class : require('passport-linkedin-oauth2').Strategy,
		param : {
			clientID: passportConfig.linkedin.id,
		    clientSecret: passportConfig.linkedin.secret,
		    callbackURL: config.host + "/auth/linkedin/callback",
		    scope: ['r_emailaddress', 'r_basicprofile']
		}
	}
};

