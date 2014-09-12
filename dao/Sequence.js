// TODO:이름을 SequenceDAO로 할걸 그랬나.?

/**
 * 
 */
//////// 전역변수 및 함수
var debug = require('debug')('nodeblog:dao:Sequence')

var sequenceIdMap = require('../config').sequenceIdMap

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var _db = mongoose.model('Seq', _getSchema())
  , H = require('../common/helper.js')
  , Status = require('../common/Status.js')


function _getSchema() {
	return {
		_id:String,
		seq:Number
	};
};
////////////

var DUPLICATE_KEY_CODE = 11000
var Sequence = module.exports = function(_id) {
	this._id = _id;
}
;
var sequenceMap = {};
Sequence.makeFor = function(done, id) {
	var dataFn = done.getDataFn() //err 무시설정이라 errFn안씀 
	  , newSequence = new Sequence(id)

	if(sequenceMap[id]) { return dataFn() }
	
	return H.call4promise([newSequence, newSequence.create])
			 .then(function () {
				 sequenceMap[id] = newSequence;
				 debug('make sequence :', id)
				 return dataFn();
			 })
			 .catch(function (error) {
				 if(error.code == DUPLICATE_KEY_CODE) {
					 debug('had been made sequence :', id)
					 sequenceMap[id] = newSequence;
					 dataFn();
					 return;
				 } else {
					 return console.error(error)
				 }
			 })
}
Sequence.getForPost = function() { return Sequence.getInstance(sequenceIdMap.post) }
Sequence.getForAnswer = function() { return Sequence.getInstance(sequenceIdMap.answer) }

Sequence.getInstance = function(id) {
	if(!sequenceMap[id]) return console.error('must will make sequence about', id)
	return sequenceMap[id];
}

// instance method
Sequence.prototype.create = function(done) {
	var doc = {_id:this._id, seq:0}
	
	_db.create(doc, done.getCallback());
};
Sequence.prototype.getNext = function (done, incNum) {
	var _incNum = incNum || 1;
	
	var conditions ={_id : this._id} //무엇을 수정할것인가
	  , update = {$inc:{seq: _incNum}} //어떻게 수정할것인가
	  , options = {'new': true,upsert: true} //new t:수정된값 , f: 원래값
	  , callback = done.getCallback();
	_db.findOneAndUpdate(conditions,update,options, callback);
};
Sequence.removeAll = function (done) {
	_remove(done, {});
}
Sequence.prototype.remove = function(done) {
	_remove(done, {_id:this._id}); 
};

function _remove(done, where) {
	done.hook4dataFn(function (data) {
		return Status.makeForRemove(data)
	})
	_db.remove(where, done.getCallback());
}

// 보조
Sequence.prototype.getId = function () {
	return this._id;
};