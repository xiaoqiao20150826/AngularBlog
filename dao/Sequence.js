
/**
 * 
 */
//////// 전역변수 및 함수
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var _db = mongoose.model('Seq', _getSchema())
  , H = require('../common/helper.js'); 
function _getSchema() {
	return {
		_id:String,
		seq:Number
	};
};
////////////

var Sequence = module.exports = function(_id) {
	this._id = _id;
};

// instance method
	
Sequence.prototype.create = function(done) {
	_db.create({_id:this._id, seq:0},H.doneOrErr(done, function(err) {
		//TODO: 중복처리 해야한다.
	}));
};
Sequence.prototype.getNext = function (done, incNum) {
	var _incNum = incNum || 1;
	
	var conditions ={_id : this._id} //무엇을 수정할것인가
	  , update = {$inc:{seq: _incNum}} //어떻게 수정할것인가
	  , options = {'new': true,upsert: true} //new t:수정된값 , f: 원래값
	  , callback = H.doneOrErr(done, function(err) {
		  console.log('findOneAndUpdate ', err);
	  })
	_db.findOneAndUpdate(conditions,update,options, callback);
};
Sequence.prototype.remove = function(done) {
		_db.remove({_id:this._id},H.doneOrErr(done, function(err) {
			console.log('remove', err);
		})); 
};
// 보조
Sequence.prototype.getId = function () {
	return this._id;
};