/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	passport = require('./common/auth/oauth-passport.js'); //설정된 passport.

var _config = require('./config.js')
  , app = express();

//1. middleware 설정. 순서주의
//  - 미들웨어는 요청에 대한 처리 후 다음에 전달.
app.configure(function () {
	app.use(express.favicon());
	app.use(express.logger('dev'));    //
	app.use(express.bodyParser());     //form 전송시 분석.
	app.use(express.methodOverride()); //post _method 골라줌.
	/////////////////////session 및 passport////////////////////////////////////////
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'secret'}));
	
	app.set('passport', passport);
	app.use(passport.initialize());
	app.use(passport.session());
	//////////////////////////
	app.use(app.router);
})

//2. url과 route를 연결해준다. 
app.configure(function () {
	var routeManager = require('./routes/routeManager.js');
	routeManager.mapUrlToResponse(app); //동적자원 매핑
	
	app.use('/resources',express.static(path.join(__dirname, '/resources'))); 	//정적자원 매핑
})

//3. 뷰 엔진설정
app.configure(function () {
	var ejsEngine = require('ejs-locals');
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs',ejsEngine);
});

//4. 개발모드일 경우만 에러 핸들러 추가.
app.configure(_config.development, function () {
	app.use(express.errorHandler());
})

//4. 서버 열고 디비 연결.

var server = http.createServer(app).listen(_config.port, function() {
	mongoose.connect(_config.db, function() {
		console.log('Express server listening on port ' + _config.port);
		console.log('db :  ' + _config.db);
	});
});

//5. 테스트를 위해 export.
module.exports = app;
module.exports.server = server;