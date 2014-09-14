/**
 * Module dependencies.
 */
var express = require('express')
  ,	http = require('http')
  ,	path = require('path')
  ,	mongoose = require('mongoose')
  ,	passport = require('./common/auth/oauth-passport.js') //설정된 passport.
var _config = require('./config.js')		
  , app = express()
var cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , cookieSession = require('cookie-session')
  , multer = require('multer')
//1. middleware 설정. 순서주의
//  - 미들웨어는 요청에 대한 처리 후 다음에 전달.
app.use(express.favicon());
app.use(bodyParser.urlencoded({extended:true}))  //for application/json
   .use(bodyParser.json())						// for application/x-www-form-urlencoded
   .use(multer({dest : '../tempFiles/'}) )          // for mutipart-formdata 로컬에서 임시파일 지우기 구현안했음
/////////////////////session 및 passport////////////////////////////////////////
app.use(cookieParser());
app.use(cookieSession({ secret: 'secret'}));

app.set('passport', passport);
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////
app.use(app.router); // controller

//config를 app를 통해 접근하기 위한 설정
app.set('config', _config);

//2. url과 controller를 연결해준다. 
var controllerManager = require('./controller/controllerManager.js');
controllerManager.mapUrlToResponse(app); //동적자원 매핑

app.use('/resources',express.static(path.join(__dirname, '/resources'))); 	//정적자원 매핑

//3. 뷰 엔진설정
var ejsEngine = require('ejs-locals');
 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout:false, root: __dirname + '/main' } );
app.engine('ejs',ejsEngine);

//3. test모드일 경우만 에러 핸들러 추가.
if(_config.mode == 'test') { 
	if(_config.mode == 'production') {
		app.use(express.logger('production'));    //
	}
	app.use(express.errorHandler());
}

//4. 서버 열고 디비 연결. + 필요 테이블 생성.

var server = http.createServer(app).listen(_config.port, function() {
	mongoose.connect(_config.db, function() {
		var H = require('./common/helper')
		var initDataCreater = require('./initDataCreater')
		
		console.log('_config.db', _config.db)
		H.call4promise(initDataCreater.create)
		 .then(function dataFn () {
			 	console.log('--------- start success ----------')
				console.log('Express server listening on port ' + _config.port);
				console.log('db :  ' + _config.db);	
		 })
		 .catch(function(err) {
			 console.log('---- db error-----')
			 console.error(err,new Error().stack)
		 })
	});
});

//5. 테스트를 위해 export.
module.exports = app;
module.exports.server = server;

// 임시] 
app.get('/close',function () {
	  mongoose.connection.close(function () {
		  //연결종료가아니라 프로세스종료를 해야지 lock이안생기는데..
		      console.log('Mongoose default connection disconnected through app termination');
		      process.exit(0);
	  });
})