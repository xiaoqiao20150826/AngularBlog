var mongoose = require('mongoose');
var should = require('should');


var _ = require('underscore')
  , async = require('async')
  , H = require('../../common/helper.js')
  , q = require('q');
var	Sequence = require('../../dao/Sequence.js');

describe('mongoDb 연동 a postDAO ', function() {
	var _id = 'testCol'
	  , _seq = new Sequence(_id);
	before(function(asyncDone) {
		mongoose.connect('mongodb://localhost/test',asyncDone)
	});
	after(function(asyncDone) {
		_seq.remove(new H.Done(function () {
			mongoose.disconnect(asyncDone);
		}));
	});
	describe('#new Sequence()', function() {
		it('should create default Seq',function (asyncDone) {
            _seq.create(new H.Done(done));
            function done(data) {
  				id = data._id;
				_id.should.equal(id);
            	asyncDone();
            };
		});
		it('여러번 호출시 값 일치하는지 확인',function (asyncDone) {
			H.asyncLoop([1,1,1,1] , [_seq,_seq.getNext], new H.Done(endDone, asyncDone))
				function endDone(results) {
//					console.log(results)
	  				var seqObj = results[3];
	  				should.equal(seqObj.seq, 4);
	  				asyncDone();
				}
		});
	});
});
