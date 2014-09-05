/**
 * 
 */
process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
var	Hooker = require('../../../../dao/util/transaction/Hooker.js')

var should = require('should')
  , _ = require('underscore')
  , H = require('../../../testHelper.js')
  , Done = H.Done

describe('Hooker', function() {
	var test
	beforeEach(function () {
		test = {}
		test.fn = function fromFn() {}
		test.fn2 = function fromFn() {}
		test.fn3 = function fromFn() {}
	})
	
	it('should hook', function () {
		var toFn = function toFn() {}
		var hooker = new Hooker(test)
		
		hooker.hook('fn', toFn)
		should.equal(test.fn.name, 'toFn')
		should.equal(hooker.originFnMap['fn'].name, 'fromFn')
	})
	
	it('should return hooked fn if call end', function () {
		var toFn = function toFn2() {}
		var hooker = new Hooker(test)
		
		hooker.hook('fn', toFn)
		hooker.hook('fn2', toFn)
		hooker.hook('fn3', toFn)
		
		should.equal(test.fn2.name, 'toFn2')
		should.equal(hooker.originFnMap['fn'].name, 'fromFn')
		hooker.end();
		should.equal(test.fn2.name, 'fromFn')
		should.equal(test.fn3.name, 'fromFn')
	})
	it('should return original test state', function () {
		var toFn1 = function toFn1() {}
		var toFn2 = function toFn2() {}
		var toFn3 = function toFn3() {}
		var hooker1 = new Hooker(test)
		var hooker2 = new Hooker(test)
		var hooker3 = new Hooker(test)
		
		hooker1.hook('fn', toFn1)
		hooker2.hook('fn', toFn2)
		hooker3.hook('fn', toFn3)
		should.equal(test.fn.name, 'toFn3')
		
		hooker3.end();
		should.equal(test.fn.name, 'toFn2')
		hooker2.end();
		should.equal(test.fn.name, 'toFn1')
		hooker1.end();
		should.equal(test.fn.name, 'fromFn')
	})
});
