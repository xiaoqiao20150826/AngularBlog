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
  
var Q = require('q')

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
	this.seq = 0
}
;
var sequenceMap = {};

Sequence.makeFor = function(id) {
	var deferred  = Q.defer()
	
	var newSequence = new Sequence(id)

	if(sequenceMap[id]) { return deferred.resolve(sequenceMap[id]) }
	
	
	newSequence.create()
			 .then(function () {
				 sequenceMap[id] = newSequence;
				 debug('make sequence :', id)
				 deferred.resolve(newSequence);
			 })
			 .catch(function (error) {
				 if(error.code == DUPLICATE_KEY_CODE) {
					 debug('had been made sequence :', id)
					 sequenceMap[id] = newSequence;
					 deferred.resolve(newSequence);
					 return;
				 } else {
					 return console.error(error)
				 }
			 })
	
	return deferred.promise
}

//이 get3개 프로마이즈가 아님.
Sequence.getForPost = function() { return Sequence.getInstance(sequenceIdMap.post) }
Sequence.getForAnswer = function() { return Sequence.getInstance(sequenceIdMap.answer) }
Sequence.getInstance = function(id) {
	if(!sequenceMap[id]) return console.error('must will make sequence about', id)
	return sequenceMap[id];
}

// instance method
Sequence.prototype.create = function() {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred)
	
	var doc = {_id:this._id, seq:this.seq}
	
	_db.create(doc, callback)
	
	return deferred.promise
};
Sequence.prototype.getNext = function (incNum) {
	var _incNum = incNum || 1;
	
	var conditions ={_id : this._id} //무엇을 수정할것인가
	  , update = {$inc:{seq: _incNum}} //어떻게 수정할것인가
	  , options = {'new': true,upsert: true} //new t:수정된값 , f: 원래값

	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred)
      
	_db.findOneAndUpdate(conditions,update,options, callback)
	
	return deferred.promise
				   .then(function(data){ return data.seq});
};
Sequence.removeAll = function () {
	return _remove({});
}
Sequence.prototype.remove = function() {
	return _remove({_id:this._id}); 
};

function _remove(done, where) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	_db.remove(where, callback)
	
	return deferred.promise
	               .then(function  (data) { return Status.makeForRemove(data) })
}

// 보조
Sequence.prototype.getId = function () {
	return this._id;
};