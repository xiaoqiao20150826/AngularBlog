/**
 * 
 */

var q = require('q')
  , _ = require('underscore')
  , should = require('should')
var H = require('../testHelper')
  , Done = H.Done;

describe('q',function () {
	describe('#all', function () {
		it('should take args', function (nextTest) {
			q.all([H.call4promise(returnData, 1,5), H.call4promise(returnData, 2), H.call4promise(returnData, 3)])
			 .then(function(a,b,c) {
				 should.deepEqual(a, [[1,5],[2],[3]])
				 should.equal(b,undefined);
				 nextTest();
			 })
			 .catch(H.testCatch1(nextTest));
		})
		//안되는듯
//		it('should take args with non promise call', function (nextTest) {
//			q.all([[returnData2,1], [returnData2,2]])
//			.then(function(a,b,c) {
//				nextTest();
//			})
//			.catch(H.testCatch1(nextTest));
//		})
	})
})

function returnData(done /*args */) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var args = _.rest(arguments);
	setTimeout(function () {
		var data = args;
		done.getCallback()(null,data);
	},2)
}
function returnData2(cb /*args */) {
	var args = _.rest(arguments);
	setTimeout(function () {
		cb(null, args);
	},2)
}