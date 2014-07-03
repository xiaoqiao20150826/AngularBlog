
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	passport = require('./common/auth/oauth-passport.js'); //설정된 passport.


//connect to the database
mongoose.connect('mongodb://localhost/nodeblog');

var app = express();

setAllEnvironments(app);
useMiddlewares(app);

//route url to any Response
routeUrlToAnyResponse(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//  mapping url to ejs
function routeUrlToAnyResponse(app) {
	var routeManager = require('./routes/routeManager.js');
	//동적자원 매핑
	routeManager.mapUrlToResponse(app);
	//정적자원 매핑
	app.use('/resources',express.static(path.join(__dirname, '/resources')));
};

// 포트 + 뷰 엔진설정 
function setAllEnvironments(app) {
	app.set('port', process.env.PORT || 3000);
	app.set('passport',passport);
	
	var ejsEngine = require('ejs-locals');
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs',ejsEngine);
};

// middleware 사용 설정. 순서주의
function useMiddlewares(app) { //요청에 대해서 선처리를 하는 미들웨어를 등록.
	app.use(express.favicon());
	app.use(express.logger('dev'));    //
	app.use(express.bodyParser());     //form 전송시 분석.
	app.use(express.methodOverride()); //post _method 골라줌.
	/////////////////////session 및 passport////////////////////////////////////////
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'secret'})); 
	app.use(passport.initialize());
	app.use(passport.session());
	//////////////////////////
	app.use(app.router);
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
};