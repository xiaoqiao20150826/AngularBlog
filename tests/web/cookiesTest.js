/**
 */

var assert = require( "assert" )
  , express = require( "express" )
  , http = require( "http" )
  , request = require('supertest')
  
describe('Express', function () {
  var server
  var agent

  before(function setup() {
    var app = express()
    app.use(express.cookieParser());
    server = http.createServer(app).listen(3333);
    
    agent =  request(app);
    })
  
  after(function () {
	  server.close();
  })

  it('should set cookies', function (nextTest) {
	app.get('/cookie', function (req, res) {
		var temp = 
		req.headers.cookie
	    	res.send(req.headers.cookie)
	})	  
	  
    agent
    .get('/cookie')
    .end(function(err,res) {
    	console.log('클라 ',res.body);
    	nextTest();
    })
  })
})