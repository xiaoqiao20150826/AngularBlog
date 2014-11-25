var mongoose = require('mongoose');
var should = require('should');


var _ = require('underscore')
  ,	H = require('../testHelper.js')
  , Q = require('q');
var	Sequence = require('../../dao/Sequence.js');

describe('mongoDb 연동 Sequence ', function() {
	var seq
	
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test', function () {
			Sequence.makeFor('id1')
			.then(function(_seq){
				seq = _seq
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))		
		})
	});
	after(function(nextTest) {
		seq.remove()
		.then(function () {
			mongoose.disconnect(nextTest);
		});
	});
	describe('#new Sequence()', function() {
		it('should create default Seq',function () {
			should.equal(seq._id, 'id1')
		});
		it('여러번 호출시 값 일치하는지 확인',function (nextTest) {
			_.reduce(_.range(0,4), function(p, i) {
				return p.then(function(val) {
							return seq.getNext()
						})	
				
			},Q())
			.then(function(val){
				should.equal(val, 4)  // 1,2,3,4 네번이면 4
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
			
		});
	});
});
