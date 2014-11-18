


var express = require('express')
  , expressApp = express();
var mongoose = require('mongoose')

var config = require('./config.js')
// **************************************
var app = module.exports = {}

app.start = function (callback) {
	this._setUp();
	this._openedServer = this._runServer(callback);
}
app._setUp = function () {
	
	var cookieParser = require('cookie-parser')
	  , bodyParser = require('body-parser')
	  , cookieSession = require('cookie-session')
	  , multer = require('multer');
	var passport = require('./common/auth/oauth-passport.js') //설정된 passport.
	var	path = require('path')
	
	//1. middleware 설정. 순서주의(미들웨어는 요청에 대한 처리 후 다음 단계에 결과 전달한다)
	expressApp.use(express.favicon());
	expressApp.use(bodyParser.urlencoded({extended:true}))  //for application/json
			 .use(bodyParser.json())						// for application/x-www-form-urlencoded
			 .use(multer({dest : config.tempFilesDir}) )          // for mutipart-formdata 로컬에서 임시파일 지우기 구현안했음
	/////////////////////session 및 passport////////////////////////////////////////
	expressApp.use(cookieParser());
	expressApp.use(cookieSession({ secret: 'secret'}));
	
	expressApp.set('passport', passport);
	expressApp.use(passport.initialize());
	expressApp.use(passport.session());
	//////////////////////////
	expressApp.use(expressApp.router); // controller
	
	//config를 app를 통해 접근하기 위한 설정  //이럴필요있나.
	expressApp.set('config', config);
	
	//2. url과 controller를 연결해준다. 
	var controllerManager = require('./controller/controllerManager.js');
	controllerManager.mapUrlToResponse(expressApp); //동적자원 매핑
	
	expressApp.use('/resource',express.static(config.resourceDir)); 	//정적자원 매핑
	
	//3. 뷰 엔진설정
	var ejsEngine = require('ejs');
	//TODO: 사실 ejs를 사용하지 않는다면. 없에도 상관없을텐데.
	expressApp.set('views', config.resourceDir); //위치를 프론트엔드로 변경.
	expressApp.set("view options", {layout: false});
	expressApp.set('view engine', 'ejs');
	expressApp.engine('html', ejsEngine.renderFile);
	
	//3. test모드일 경우만 에러 핸들러 추가.
	if(config.mode == 'test') { 
		if(config.mode == 'production') {
			expressApp.use(express.logger('production'));    //
		}
		expressApp.use(express.errorHandler());
	}
	
}
app._runServer = function (callback) {
	//4. 서버 열고 디비 연결
	var	http = require('http')
	return http.createServer(expressApp).listen(config.port, function() {
		mongoose.connect(config.db, callback);
	});
}

// 임시] 
app.closeDb = function () {
	  mongoose.connection.close(function () {
		  //연결종료가아니라 프로세스종료를 해야지 lock이안생기는데..
		      console.log('Mongoose default connection disconnected through app termination');
		      process.exit(0);
	  });
}