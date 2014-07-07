// exchange  your ID, your Secret

var oauthConfig = {
	facebook : {
		Class : require('passport-facebook').Strategy,
		param : {
			clientID : 'your ID',
			clientSecret : 'your Secret',
			callbackURL : "http://nodeblog.com:3000/auth/facebook/callback",
			scope : ['read_stream', 'email'] ,
			profileFields : ['id', 'displayName', 'gender', 'photos', 'emails']  
		}
	},
	twitter : { //트위터는 이메일 정보는 제공하지 않는다고 한다.
		Class : require('passport-twitter').Strategy,
		param : {
			consumerKey : 'your ID',
			consumerSecret : 'your Secret',
			callbackURL : "http://nodeblog.com:3000/auth/twitter/callback",
		}
	},
	github : {
		Class : require('passport-github').Strategy,
		param : {
			clientID : 'your ID',
			clientSecret : 'your Secret',
			callbackURL : "http://nodeblog.com:3000/auth/github/callback",
			scope : 'user'
		}
	},
	google : {
		Class : require('passport-google-oauth').OAuth2Strategy,
		param : {
			clientID: 'your ID',
		    clientSecret: 'your Secret',
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
			clientID: 'your ID',
		    clientSecret: 'your Secret',
		    callbackURL: "http://nodeblog.com:3000/auth/linkedin/callback",
		    scope: ['r_emailaddress', 'r_basicprofile']
		}
	}
};

module.exports = oauthConfig;