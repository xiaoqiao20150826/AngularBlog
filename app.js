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
	app.use(express.bodyParser());     //form 전송시 분석.
	app.use(express.methodOverride()); //post _method 골라줌.
	/////////////////////session 및 passport////////////////////////////////////////
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'secret'}));
	
	app.set('passport', passport);
	app.use(passport.initialize());
	app.use(passport.session());
	//////////////////////////
	app.use(app.router); // controller
	
	//config를 app를 통해 접근하기 위한 설정
	app.set('config', _config);
})

//2. url과 controller를 연결해준다. 
app.configure(function () {
	var controllerManager = require('./controller/controllerManager.js');
	controllerManager.mapUrlToResponse(app); //동적자원 매핑
	
	app.use('/resources',express.static(path.join(__dirname, '/resources'))); 	//정적자원 매핑
})

//3. 뷰 엔진설정
app.configure(function () {
	var ejsEngine = require('ejs-locals');
	 
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('view options', { layout:false, root: __dirname + '/main' } );
	app.engine('ejs',ejsEngine);
});

//4. 개발모드일 경우만 에러 핸들러 추가.
app.configure(_config.mode, function () {
	if(_config.mode == 'production') {
		app.use(express.logger('production'));    //
	}
	app.use(express.errorHandler());
})

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