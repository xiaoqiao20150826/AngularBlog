/**
 * 
 */


var should = require('should')
  , _ = require('underscore')

var Cookie = require('../../../routes/common/Cookie.js')

describe('cookie', function() {
	var res = {cookie:function(){}};		
		describe('$get', function() {
			it('should get value in Cookie by wrong key', function () {
				var req = {cookies: {}}
				var cookie = new Cookie(req, res);
				var list= cookie.get('keywef');
				should.deepEqual([], list);
			})
			it('should get value in Cookie with empty value', function () {
				var req = {cookies: {'post':''}}
				var cookie = new Cookie(req, res);
				var list= cookie.get('post');
				should.deepEqual([], list);
			})
			it('should get list in Cookie with list', function () {
				var req = {cookies: {'post':[2,1]}}
				var cookie = new Cookie(req, res);
				var list= cookie.get('post');
				should.deepEqual([2,1], list);
			})
		});
		describe('$set', function() {
			it('should set ', function () {
				var req = {cookies: {'post':[2,1]}}
				var cookie = new Cookie(req, res);
				var list = cookie.set('post', 5);
				should.deepEqual([2,1,5],list)
			})
			it('should set ', function () {
				var req = {cookies: {'post':[2,5,7]}}
				var cookie = new Cookie(req, res);
				var list = cookie.set('post', 5);
				should.deepEqual([2,5,7],list)
			})
		})
	
})