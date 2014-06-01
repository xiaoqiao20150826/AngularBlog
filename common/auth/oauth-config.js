var oauthConfig = {
	facebook : {
		class : require('passport-facebook').Strategy,
		param : {
			clientID : '717438024968384',
			clientSecret : 'dc50031853d3c00c25b3a69a2116728d',
			callbackURL : "http://nodeblog.com:3000/auth/facebook/callback",
			scope : ['read_stream', 'email'] ,
			profileFields : ['id', 'displayName', 'gender', 'photos', 'emails']  
		}
	},
	twitter : {
		class : require('passport-twitter').Strategy,
		param : {
			consumerKey : '1RdSoEtx7gF6HpqQHIVfIl9Sp',
			consumerSecret : 'CKyCUFIL7KGlOZet69ViKC4VWAde74tqjCsudNoY5Nq0DP1TMg',
			callbackURL : "http://nodeblog.com:3000/auth/twitter/callback",
		}
	},
	github : {
		class : require('passport-github').Strategy,
		param : {
			clientID : '7203d6d7fcbda1a3cb74',
			clientSecret : 'ca91ff48fdf358639d51a5c9056e7ad8ac5cebc3',
			callbackURL : "http://nodeblog.com:3000/auth/github/callback"
		}
	},
	google : {
		class : require('passport-google-oauth').OAuth2Strategy,
		param : {
			clientID: '917517471539-ook27tnh8jogllbluonvbj23uqgp5am4.apps.googleusercontent.com',
		    clientSecret: '00tjJUoikbHDYURoXpqmFLhG',
		    callbackURL : 'http://nodeblog.com:3000/auth/google/callback',
		}
	},
	linkedin : {
		class : require('passport-linkedin').Strategy,
		param : {
			consumerKey: '75bnyvlr8v938l',
		    consumerSecret: '6lTauQ9Bhf7asQaC',
		    callbackURL: "http://nodeblog.com:3000/auth/linkedin/callback",
		    scope: ['r_emailaddress', 'r_basicprofile'],
		}
	}
};

module.exports = oauthConfig;