/**
 * 
 */
var H = require('./app/common/helper')
var config = require('./app/config')
  , app = require('./app/app')
  , initDataCreater = require('./app/initDataCreater');
  
(function bootstrap() {
	//1. *** node 환경변수에 적합한 mode의 config 설정
	
	config.mode = process.env.NODE_ENV || undefined
	if(config.mode == 'production') config.productionMode();
	if(config.mode == 'development') config.developementMode();
	if(config.mode == 'test' || config.mode == undefined) config.testMode();
		
	console.log('mode is '+ config.mode)
	console.log('db is '+ config.db)
	console.log('host is '+ config.host)
	
	//2.  *** server start
	app.start(function(err, data) {
		if(err) return console.log('mongo err : ', err)
		H.call4promise(initDataCreater.create)
		 .then(function dataFn () {
			 	console.log('--------- start success ----------')
				console.log('Express server listening on port ' + config.port);
		 })
		 .catch(function(err) {
			 console.log('---- db error-----')
			 console.error(err,new Error().stack)
		 })
	});
	
})()

