/*
 * config 공통으로 사용되는 환경설정.
 * 
 */

/*
 *   test config, development config 구분 방법.
 * 1. 이용 원리
 *   - express는 초기화시 암시적으로 app.set('env', process.env.Node_ENV || 'development')를 해준다. 
 *   - express초기화 전에 precess.env.NODE_ENV 값을 변경하거나 설정해줌으로써
 *     어떤 환경으로 시작할 것인지 구분할 수 있다. 
 *   - express에서 app.get('env')를 읽어서 필요한 구분을 해준다.
 * 2. 값 변경 방법
 *    - 콘솔에서 NODE_ENV=test node app  실행할때 변경시키기.
 *    - 직접 변경하려면 process.env.NODE_ENV 값을 express초기화 전에 변경하면 된다.
 */


var config = module.exports = {};
var _env = process.env
//공통 설정.
config.port = _env.PORT || 3000; //
config.rootDir = __dirname;

//mongolab
config.mongolabId = _env.MONGOLAB_ID
config.mongolabPw = _env.MONGOLAB_PW

//passport api key
// id를 key로 할껄그랬나
config.passport = {}
config.passport.facebook = {'id' : _env.PASSPORT_FACEBOOK_ID, 'secret': _env.PASSPORT_FACEBOOK_SECRET}
config.passport.twitter = {'id' : _env.PASSPORT_TWITTER_ID, 'secret': _env.PASSPORT_TWITTER_SECRET}
config.passport.github = {'id' : _env.PASSPORT_GITHUB_ID, 'secret': _env.PASSPORT_GITHUB_SECRET}
config.passport.google = {'id' : _env.PASSPORT_GOOGLE_ID, 'secret': _env.PASSPORT_GOOGLE_SECRET}
config.passport.linkedin = {'id' : _env.PASSPORT_LINKEDIN_ID, 'secret': _env.PASSPORT_LINKEDIN_SECRET}

//cloudinary
config.cloudinary = {'name' : _env.CLOUDINARY_NAME, 'key' : _env.CLOUDINARY_KEY, 'secret' : _env.CLOUDINARY_SECRET }

// sequenceId
config.sequenceIdMap = {}
config.sequenceIdMap.post = 'post'
config.sequenceIdMap.answer = 'answer'
	
// 환경변수 mode에 따라 config 값을 변화시킨다.
var PRODUCTION = 'production'
  , DEVELOPMENT = 'development'
  , TEST = 'test'
config.mode = _env.NODE_ENV || DEVELOPMENT;
(function () {
	config.isLocal = true;
	config.imgDir = config.rootDir + '/resources/img'; // local
	config.tempFilesDir = './tempFiles/';
	
	//server
	if(config.mode == PRODUCTION) {
		config.db = 'mongodb://'+config.mongolabId+':'+config.mongolabPw+'@ds035310.mongolab.com:35310/nodeblog'
		config.host = 'http://elfmagic86.herokuapp.com';
		config.isLocal = false;
		config.imgDir = ''
	}
	//local
	else if(config.mode == DEVELOPMENT) {
		config.db = 'mongodb://'+config.mongolabId+':'+config.mongolabPw+'@ds035310.mongolab.com:35310/nodeblog'
		config.host = 'http://elfmagic86.herokuapp.com';
		config.isLocal = false;
		config.imgDir = ''
	}
	else {
		config.db = 'mongodb://localhost/test';  
		config.host = 'http://nodeblog.com' + ':' + config.port
		config.tempFilesDir = '../tempFiles/';
//		config.isLocal = false //test
//		config.imgDir = ''// test
	}
	
	console.log('mode is '+ config.mode)
	console.log('db is '+ config.db)
	console.log('host is '+ config.host)
})()

