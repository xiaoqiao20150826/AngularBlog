/**
 * 
 */

var _ = require('underscore')
  , should = require('should');

var testHelper = require('./testHelper');

describe('testHelper', function () {
	describe('#createObjs', function () {
		it('should good run with object', function () {
			var some = {}
			  , count = 10
			  , fields4TempValue = ['title','content'];
			
			var someList = testHelper.createObjs(some, count, fields4TempValue)
			should.equal(someList.length, count);
			should.deepEqual(_.keys(someList[0]), fields4TempValue );
		})
		it('should good run with type', function () {
			var Type = function () {}
			  , count = 10
			  , fields4TempValue = ['title','content'];
			var someList = testHelper.createObjsByType(Type, count, fields4TempValue)
			should.equal(someList.length, count);
			should.deepEqual(_.keys(someList[0]), fields4TempValue );
		})
	})
	describe('#deepEqualsBykeys', function () {
		it('should good run with some', function () {
			var a = { a:[1,2,3], b: {a:2,b:4}, c: 1};
			var b = { a:[1,2,3], b: {a:4,b:1}, c: 1};
			var keys = ['a','c'];
			
			testHelper.deepEqualsByKeys(a,b,keys);
		})
		it('should good run with some', function () {
			var a = {}, b = {}
			  , count = 10
			  , keysA = ['title','content']
			  , keysB = ['title','content', 'etc'];
			var aList = testHelper.createObjs(a, count+8, keysA);
			var bList = testHelper.createObjs(b, count, keysB)
			
			testHelper.deepEqualsByKeys(aList,bList,keysA);
		})
	});
})