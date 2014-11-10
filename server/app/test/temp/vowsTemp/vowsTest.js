/**
 * 
 */

var vows = require('vows'),
	assert = require('assert');

//2. 테스트 정의
var suite = vows.describe('vows test');	
var context1 = {
		'context1' : {
			topic: 'topic',
			'is vow' : function(topic) {
				return topic + 'vow1';
			},
			'is vow2' : function(topic2) {
				return topic2 + 'vow2';
			}
		}
};
var context2 = {
		'context2' : {
			topic: 'topic2',
			'is vow' : function(topic) {
				assert.equal(topic,'topic2');
			},
			'is vow2' : function(topic2) {
				return topic2 + 'vow2';
			}
		}
};

//-------------3. 실행
suite.addBatch(context1).addBatch(context2).run();
