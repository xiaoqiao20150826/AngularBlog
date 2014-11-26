/**
 * answerDAO (싱글톤)
 */


/* 초기설정 (외부참조 설정 및 초기화) */
// 외부 참조
var Answer = require('../../domain/blogBoard/Answer.js')
	,Sequence = require('../Sequence.js')
	,Q = require('q')
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId4Schema = Schema.ObjectId
  , ObjectId = mongoose.Types.ObjectId
  , answerSchema = new Schema(getSchema())

var _ = require('underscore')
  , H = require('../../common/helper.js')
  , Status = require('../../common/Status.js')
  , _db = mongoose.model('Answer', answerSchema)

// 초기화
var answerDAO = module.exports = {}
///////////////////////////////////////////////////////////////////////////

/** 
 * functions(싱글톤) 
 */

/* remove */
function _remove(where) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {};
	_db.remove(where, callback);
	
	return deferred.promise
	               .then(function (data) {
	           			return Status.makeForRemove(data);
	           		})
};
answerDAO.removeOne = function (answer) {
	var where = {num: answer.num}
	return _remove(where);
};
answerDAO.removeByUserId = function (userId) {
	var where = {'userId': userId}
	return _remove(where);
};
answerDAO.removeByPostNums = function (postNums) {
	var where = {postNum: {$in : postNums} }
	return _remove(where);
};
//이거사용하나요.
answerDAO.removeAllByPostNum = function (postNum) {
	var where = { postNum: postNum}
	return _remove( where);
};
//댓글의 댓글까지 삭제.
answerDAO.removeAllOfNum = function (allNums) {
	var where = {num: {$in : allNums} }
	return _remove(where);
};
answerDAO.removeAll = function () {
	var _seq = Sequence.getForAnswer()
	
	return Q.all([ 
	               _seq.remove()
		         , _remove({})
	        	])
};
/* find */
answerDAO.find = function (where,select) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
	  , select = select || {}
	  , orderBy = { 'num' : -1 }
	  
	_db.find(where,select).sort(orderBy).exec(callback);
	  
	return deferred.promise.then(Answer.createBy)  
};

answerDAO.findByPostNum = function(postNum) {
	var where = {postNum:postNum};
	return answerDAO.find(where);
};
answerDAO.findByNum = function (num) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = {'num': num}
		,select = select || {}
		
	_db.findOne(where,select).exec(callback);
	
	return deferred.promise.then(Answer.createBy)
};
//answerDAO.findByAnswerNums = function (done, answerNums) {
//	var where = {'answerNum': {$in : answerNums}}
//		,select = select || {};
//		
//	answerDAO.find(done, where, select)
//}

answerDAO.findByRange = function (postNum, start,end) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = {postNum:postNum}
		,select = {}
		,orderBy = { 'num' : 1 }
	var startNum = start - 1; // 배열스타일의 인덱스라 실제 개수와 일치시키기위해 -1 한다.
	var limitNum = end-start;
	if(startNum < 0) startNum = 0;
	
	_db.find(where,select).sort(orderBy).skip(startNum).limit(limitNum).exec(callback);
	
	return deferred.promise.then(Answer.createBy)
};
/* insert */
answerDAO.insertOne = function(answer) {
	var _seq = Sequence.getForAnswer()
	
	return _seq.getNext()
			.then(function(seqNum) {
				answer.num = seqNum
				return _create(answer);
			})
};
function _create(data) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	if(!data._id) data._id = new ObjectId()
	
	_db.create(data, callback); // exec없음.
	
	return deferred.promise.then(Answer.createBy)
}
/* update */
//TODO: 업데이트할 데이터에 answer를 통채로 주므로 업데이트 하지말아야할 데이터는 잘 걸러서 줘야한다. 
answerDAO.update = function(answer) {
	if(!(H.exist(answer.num))) throw 'num은 필수';
	
	var where = {num : answer.num}
	  , data = { content:answer.content 
			   , writer: answer.writer 
			   }
	
	return _update(where, data);
};
// private
function _update(where, data, config) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
	
	_db.update(where, data, config, callback);
	
	return deferred.promise.then(function (result) {
								return Status.makeForUpdate(result);
							})
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
answerDAO.getCount = function (where) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
	_db.find(where).count().exec(callback);
	
	return deferred.promise;
}

function getSchema() {
	return {
		'_id': {type:ObjectId4Schema}, // default로 값을 할당하면 create 후 id가 반환되지않는다. 
        'num' : Number,
        'created' : Date,
        'content' : String,
        'userId' : String,
        'writer' : String,
        'postNum' : Number,
        'answerNum' : Number,
        'password' : String
		};
};
/* helper */		
