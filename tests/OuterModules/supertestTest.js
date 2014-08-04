/**
 * 
 */
var TEST_NAME = 'OuterModules:supertest'
  , log = require('debug')(TEST_NAME)
  , should = require('should');


var express = require('express')
  , http = require('http')
  , request = require('supertest');

var H = require('../testHelper.js');

describe(TEST_NAME, function () {
	var agent, app, servcer;
	before(function(nextTest) {
		app = express();
		server = http.createServer(app).listen(function() {
			nextTest()
		});
		agent =  request(app);
	})
	after(function() {
		server.close();
	});
	
	it('should run simple request and response ', function (nextTest) {
		var text = 'abcd ddd'
		
		app.get('/', function(req, res) {
			res.send(text)
		})
		
		agent
        .get('/')
        .expect(200)
        .end(function(err, res) {//응답
        	if(err) H.testCatch1(nextTest);
        	log('res.text', res.text);
        	should.deepEqual(res.text, text);
        	nextTest();
        });
	})
})
