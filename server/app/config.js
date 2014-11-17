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

var _path = require('path')
var _env = process.env
///
var config = module.exports = (function(){
	var commonConfig = {}
	//공통 설정.
	commonConfig.isLocal = false;
	commonConfig.port = _env.PORT || 3000; //
	
	commonConfig.resourceDir = _path.join(__dirname, '../../client')
	commonConfig.viewDir = commonConfig.resourceDir +'/src/app/view'
	commonConfig.staticDir = commonConfig.resourceDir +'/static'
	commonConfig.tempFilesDir = '../tempFilesDir'  //multer를 위한것.
	commonConfig.imgDir = '' // use cloudinary
	//mongolab
	commonConfig.mongolabId = _env.MONGOLAB_ID
	commonConfig.mongolabPw = _env.MONGOLAB_PW

	//passport api key 
	commonConfig.passport = {}
	commonConfig.passport.facebook = {'id' : _env.PASSPORT_FACEBOOK_ID, 'secret': _env.PASSPORT_FACEBOOK_SECRET}
	commonConfig.passport.twitter = {'id' : _env.PASSPORT_TWITTER_ID, 'secret': _env.PASSPORT_TWITTER_SECRET}
	commonConfig.passport.github = {'id' : _env.PASSPORT_GITHUB_ID, 'secret': _env.PASSPORT_GITHUB_SECRET}
	commonConfig.passport.google = {'id' : _env.PASSPORT_GOOGLE_ID, 'secret': _env.PASSPORT_GOOGLE_SECRET}
	commonConfig.passport.linkedin = {'id' : _env.PASSPORT_LINKEDIN_ID, 'secret': _env.PASSPORT_LINKEDIN_SECRET}

	//cloudinary
	commonConfig.cloudinary = {'name' : _env.CLOUDINARY_NAME, 'key' : _env.CLOUDINARY_KEY, 'secret' : _env.CLOUDINARY_SECRET }

	// sequenceId
	commonConfig.sequenceIdMap = {}
	commonConfig.sequenceIdMap.post = 'post'
	commonConfig.sequenceIdMap.answer = 'answer'
	
	return commonConfig;
})();

///// mode별 설정 현재는 testmode(로컬)말고는 별차이없음.
config.productionMode = function () {
	config.db = 'mongodb://'+config.mongolabId+':'+config.mongolabPw+'@ds039550.mongolab.com:39550/nodeblog'
	config.host = 'http://elfmagic86.herokuapp.com';
}
config.developementMode = function () {
	config.db = 'mongodb://'+config.mongolabId+':'+config.mongolabPw+'@ds039550.mongolab.com:39550/nodeblog'
	config.host = 'http://elfmagic86.herokuapp.com';
}
config.testMode = function () {
	config.db = 'mongodb://localhost/test';
	config.host = 'http://nodeblog.com' + ':' + config.port
	
	config.isLocal = true;
	config.imgDir = config.staticDir + '/img'; // local
	//passport 파라미터는 필수기에 사용하지 않을 경우.
	var wrongIdAndPw = 'canNotUsePassportIfUseThis';   
	config.passport.facebook = {'id' : _env.LOCAL_PASSPORT_FACEBOOK_ID || wrongIdAndPw, 'secret': _env.LOCAL_PASSPORT_FACEBOOK_SECRET || wrongIdAndPw}
	config.passport.twitter = {'id' : _env.LOCAL_PASSPORT_TWITTER_ID || wrongIdAndPw, 'secret': _env.LOCAL_PASSPORT_TWITTER_SECRET || wrongIdAndPw}
	config.passport.github = {'id' : _env.LOCAL_PASSPORT_GITHUB_ID || wrongIdAndPw, 'secret': _env.LOCAL_PASSPORT_GITHUB_SECRET || wrongIdAndPw}
	config.passport.google = {'id' : _env.LOCAL_PASSPORT_GOOGLE_ID || wrongIdAndPw, 'secret': _env.LOCAL_PASSPORT_GOOGLE_SECRET || wrongIdAndPw}
	config.passport.linkedin = {'id' : _env.LOCAL_PASSPORT_LINKEDIN_ID || wrongIdAndPw, 'secret': _env.LOCAL_PASSPORT_LINKEDIN_SECRET || wrongIdAndPw}
}