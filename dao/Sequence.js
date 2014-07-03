
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
	
Sequence.prototype.create = function(doneOrErrFn) {
	var doc = {_id:this._id, seq:0}
	  , doneOrErrFn = doneOrErrFn || function emptyDon() {}; //하는 일이 없다.
	  
	_db.create(doc, H.getCallbackTemplate(doneOrErrFn , errFn));
	 //TODO: 현재 중복에러무시.
	function errFn(err) { 
		console.log(err);
		console.log(err.match('duplicate'))
	}
};
Sequence.prototype.getNext = function (doneOrErrFn, incNum) {
	var _incNum = incNum || 1;
	
	var conditions ={_id : this._id} //무엇을 수정할것인가
	  , update = {$inc:{seq: _incNum}} //어떻게 수정할것인가
	  , options = {'new': true,upsert: true} //new t:수정된값 , f: 원래값
	  , callback = H.getCallbackTemplate(doneOrErrFn, function(err) {
		  console.log('findOneAndUpdate ', err);
	  })
	_db.findOneAndUpdate(conditions,update,options, callback);
};
Sequence.prototype.remove = function(doneOrErrFn) {
	_db.remove({_id:this._id}, H.getCallbackTemplate(doneOrErrFn, function(err) {
		console.log('seq : remove :', err);
	})); 
};
// 보조
Sequence.prototype.getId = function () {
	return this._id;
};