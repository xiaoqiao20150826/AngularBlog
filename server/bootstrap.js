/**
 * 
 */
var H 	   			= require('./app/common/helper')

var config 			= require('./app/config')
  , app    			= require('./app/app')
  , initDataCreater = require('./app/initDataCreater');
  
(function bootstrap() {
	//1. *** node 환경변수에 적합한 mode의 config 설정
	
	config.mode = process.env.NODE_ENV || 'test'
	
	if(config.mode == 'production') 					 config.productionMode();
	if(config.mode == 'development') 					 config.developementMode();
	if(config.mode == 'test' || H.notExist(config.mode)) config.testMode();
		
	console.log(':::::  mode is '+ config.mode)
	
	//2.  *** server start
	app.start(function(err, data) {
		if(err) {
		}else {

			initDataCreater.create()
			 .then(function dataFn () {
				    console.log('::::: init data create success')	
				 	console.log('--------- start success ----------')
			 })
			 .catch(function(err) {
				 console.error('----init data create fail-----')
				 console.error(err)
			 })
			
		}
	});
})()

