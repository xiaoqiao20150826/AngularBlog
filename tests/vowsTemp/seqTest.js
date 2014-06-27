/**
 * 
 */

var mongoose = require('mongoose');

var vows = require('vows'),
	assert = require('assert');

var _ = require('underscore'),
	helper = require('../common/helper.js');
var	Sequence = require('../dao/Sequence.js');

mongoose.connect('mongodb://localhost/nodeblog');
vows.describe('시퀀스 테이블을 만들고 자동증가를 테스트한다').addBatch({
	'seqDAO with testCol' : {
		topic : function() {
			var seq = this.seq = new Sequence('testCol');
			seq.getNum();
			seq.getNum();
			seq.getNum(this.callback);
		}
		,'여러번 호출시 시퀀스값 일치하는지 확인' : function(err, data) {
			var args = _.toArray(arguments);
			console.log(this.seq);
			helper.doneOrNext(done).apply(null,args);
			function done(data) {
				console.log('-------------------'+data);
				assert.equal(data.seq,3);
			}
		}
//		,'sub-context 정리용' : {
//			topic:'cleanup',
//			'ss' : function() {
//				console.log('--cleanup');
//				mongoose.disconnect(function(){console.log('disconnect')});
//			}
//		}
	}
}).run();
