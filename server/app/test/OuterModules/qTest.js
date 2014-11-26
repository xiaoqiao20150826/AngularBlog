/**
 * 
 */

var Q = require('q')
  , _ = require('underscore')
  , should = require('should')
var H = require('../testHelper')

describe('Q',function () {
	describe('#all', function () {
		it('should take args', function (nextTest) {
			Q.all([returnData( 1,5), returnData( 2), returnData( 3)])
			 .then(function(a,b,c) {
				 should.deepEqual(a, [[1,5],[2],[3]])
				 should.equal(b,undefined);
				 nextTest();
			 })
			 .catch(H.testCatch1(nextTest));
		})
	})
})

function returnData(/*args */) {
	var deferred = Q.defer()
	
	var args = [].slice.call(arguments)
	setTimeout(function () {
		deferred.resolve(args);
	},2)
	
	return deferred.promise
}
