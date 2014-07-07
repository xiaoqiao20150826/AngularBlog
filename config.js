/*
 * config
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

// 설정 구분자.
var DEVELOPMENT = 'development'
  , TEST = 'test';

// 설정
var developmentConfig = {
		db : 'mongodb://localhost/nodeblog'
		, port : 3000 		
};


var testConfig = {
		db : 'mongodb://localhost/test'
		, port : 3000 		
};

// 구분하여 올바른 설정을 전달해준다.
module.exports = (function () {
	var env = process.env.NODE_ENV || DEVELOPMENT;
	if(env == DEVELOPMENT) return developmentConfig;
	if(env == TEST) return testConfig;
	return {};
})()
module.exports.development = DEVELOPMENT;