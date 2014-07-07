/**
 * 
 */

var request = require('supertest');
var H = require('../testHelper.js');

describe('request', function () {
	var agent, app;
	before(function() {
		process.env.NODE_ENV = 'test';
		app = require('../../app.js');
		agent =  request(app);
	})
	after(function() {
		app.server.close();
	});
	
	it('should run simple request and response ', function (nextTest) {
		agent
        .get('/')
        .expect(200)
        .end(function(err, res) {
        	if(err) H.testCatch1(nextTest);
        	
        	htmlText =  res.text;
        	console.log(htmlText);
        	nextTest();
        });
	})
})
