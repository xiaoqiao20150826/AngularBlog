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
    app.get('/set', function (req, res) {
    	req.headers.cookie = {test: [1,2,'333','44']}
    	console.log('req.headers);.cookie  ', req.headers.cookie);
    	res.send(req.headers.cookie)
    })
    app.get('/', function (req, res) {
    	console.log('req.headers);.cookie  ', req.headers.cookie);
    	res.send(req.headers.cookie)
    })
    
    server = http.createServer(app).listen(3333);
    
    agent =  request(app);
    })
  
  after(function () {
	  server.close();
  })

  it('should set cookies', function (nextTest) {
    agent
    .get('/set')
    .end(function(err,res) {
    	console.log('클라 ',res.body);
    	nextTest();
    })
  })
  it('should get cookies', function (nextTest) {
    request(server)
    .get('/')
    .end(function(err,res) {
    	console.log('클라 ',res.body);
    	nextTest();
    })
  })
})