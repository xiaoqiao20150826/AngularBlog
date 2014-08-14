/**
 * 
 */


var should = require('should')
  , _ = require('underscore')

var requestParser = require('../../../routes/common/requestParser.js')

describe('requestParser', function() {
	  var req = { query : {}
			    , body : {}
			    , params : {}
	  };	
	describe('#getRawData', function () {
		it('should run' , function () {
			req.query = {a:1, b:2, fn1 : function() {}}
			req.body = {c:3, d:4 , fn2: function() {}, array: [1,2]}
			
			var raw = requestParser.getRawData(req)
//			console.log(raw);
			should.equal(raw.a, 1)
			should.equal(raw.d, 4);
			should.deepEqual(raw.array, [1,2]);
			should.equal(raw.fn1, undefined);
			should.equal(raw.fn2, null);
		})
	})
	
})