/**
 * 
 */

var should = require('should');

var request = require('supertest')
  , _ = require('underscore');

var H = require('../testHelper.js');

describe('passport(github)', function () {
	var agent, app, passport;
	before(function() {
		process.env.NODE_ENV = 'test';
		app = require('../../app.js');
		passport = app.get('passport');
		agent =  request(app);
	})
	after(function() {
		app.server.close();
	});
	describe('#authenticate("github")', function () {
		it('should run authcallback ', function (nextTest) {
			agent
			.get('/auth/github')
            .send({ username: 'admin', password: 'admin' })
            .end(function(err, res) {
            	if(err) H.testCatch1(nextTest);
            	
            	should.equal(res.status, 302);
            	should.exist(res.headers['set-cookie'])
//	        	_log(res,['location','body','text','headers','redirect','domain'])
	        	nextTest();
        	});
		})
		//TODO: 보류. 어떻게 테스트해야할지 잘모르겠다.
//		it('should run authcallback ', function (nextTest) {
//			agent
//			.get('/auth/github/callback?sss="ss"')
//			.end(function(err, res) {
//				if(err) H.testCatch1(nextTest);
////	        	_log(res,['location','body','text','headers','redirect','domain'])
//				nextTest();
//			});
//		})
	})
})
function _log(res, keys) {
	for(var i in keys) {
			console.log(keys[i]+' : '+ JSON.stringify(res[keys[i]]));
	}
}