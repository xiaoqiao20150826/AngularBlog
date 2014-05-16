
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var app = express();

// all environments
setAllEnvironments(app);
useAllEnvironments(app);
//route url to any Response
routeUrlToAnyResponse(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//////helper
function routeUrlToAnyResponse(app) {
	app.get('/', routes.index);
	app.get('/users', user.list);
};
function setAllEnvironments(app) {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
};
function useAllEnvironments(app) { //req에 대해서 선처리를 하는 미들웨어를 등록.
	app.use(express.favicon());
	app.use(express.logger('dev'));    //
	app.use(express.bodyParser());     //form 전송시 분석.
	app.use(express.methodOverride()); //post _method 골라줌.

	app.use(app.router);
	app.use('/resources',express.static(path.join(__dirname, '/public')));
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
};