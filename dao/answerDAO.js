/**
 * answerDAO (싱글톤)
 */


/* 초기설정 (외부참조 설정 및 초기화) */
// 외부 참조
var Answer = require('../domain/Answer.js')
	,Sequence = require('./Sequence.js')
	,Q = require('q');
var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,answerSchema = new Schema(Answer.getSchema());

var SEQ_ID = 'Answer';
var _ = require('underscore')
	,H = require('../common/helper.js')
	,_seq = new Sequence(SEQ_ID)
	,_db = mongoose.model('Answer', answerSchema);

// 초기화
_seq.create();
var answerDAO = module.exports = {};
///////////////////////////////////////////////////////////////////////////

/** 
 * functions(싱글톤) 
 */

/* remove */
function _remove(doneOrErrFn, where) {
	var where = where || {}
	  , callback = H.getCallbackTemplate(doneOrErrFn);
	  
	_db.remove(where, callback);
};
answerDAO.removeOne = function (doneOrErrFn, answer) {
	var where = {num: answer.num}
	
	_remove(doneOrErrFn, where);
};
answerDAO.removeAll = function (doneOrErrFn) {
	var done = doneOrErrFn.done
	  , errFn = doneOrErrFn.errFn || H.defaultCatch;
	
	return Q.all([H.call4promise([_seq,_seq.remove]), H.call4promise(_remove, {})])
	 		.then(done)
	 		.catch(errFn);
};
/* find */
answerDAO.find = function (doneOrErrFn,where,select) {
	var where = where || {}
		,select = select || {}
		,callback = H.getCallbackTemplate(doneOrErrFn);
	  _db.find(where,select).exec(callback);
};
answerDAO.findByPostNum = function(doneOrErrFn, postNum) {
	var where = {postNum: postNum};
	answerDAO.find(doneOrErrFn, where);
};
answerDAO.findByNum = function (doneOrErrFn, num) {
	var where = {'num': num}
		,select = select || {}
		,callback = H.getCallbackTemplate(doneOrErrFn);
	_db.findOne(where,select).exec(callback);
};
answerDAO.findByRange = function (doneOrErrFn, postNum, start,end) {
	var where = {postNum:postNum}
		,select = {}
		,orderBy = { 'num' : 1 }
		,callback = H.getCallbackTemplate(doneOrErrFn);
	var startNum = start - 1; // 배열스타일의 인덱스라 실제 개수와 일치시키기위해 -1 한다.
	var limitNum = end-start;
	if(startNum < 0) startNum = 0;
	
	_db.find(where,select).sort(orderBy).skip(startNum).limit(limitNum).exec(callback);
};
/* insert */
answerDAO.insertOne = function(doneOrErrFn, answer) {
	var done = doneOrErrFn.done
	  , errFn = doneOrErrFn.errFn || H.defaultCatch;
	
	return H.call4promise([_seq,_seq.getNext])
			.then(function(data) {
				answer.num = data.seq;
				return H.call4promise(_create, answer);
			})
			.then(done)
			.catch(errFn);
};
function _create(doneOrErrFn, data) {
	_db.create(data, H.getCallbackTemplate(doneOrErrFn)); // exec없음.
}
/* update */
//TODO: 업데이트할 데이터에 Answer를 통채로 주므로 업데이트 하지말아야할 데이터는 잘 걸러서 줘야한다. 
answerDAO.update = function(doneOrErrFn, answer) {
	if(!(H.exist(answer.num))) throw 'num은 필수';
	var where = {num : answer.num}
		,data = answer;
	_update(doneOrErrFn, where, data);
};
answerDAO.incVote = function(doneOrErrFn, num) {
	var where = {num : num}
		,data = {$inc:{vote:1}};
	_update(doneOrErrFn, where, data);
};
// private
function _update(doneOrErrFn, where, data, config) {
	if(!(H.exist(doneOrErrFn))) throw 'done need';
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
		,callback = H.getCallbackTemplate(doneOrErrFn);
	_db.update(where, data, config).exec(callback);
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
answerDAO.getCount = function (doneOrErrFn, where) {
	var where = where || {}
		,callback = H.getCallbackTemplate(doneOrErrFn);
	_db.find(where).count().exec(callback);
}
// mongoose에 group함수는 안되서 aggregate로 변경. 
// [] 전달시 파이프라인 사용이다.
answerDAO.getCountsByPosts = function (doneOrErrFn, posts) {
	var postNums = [];
	for(var i in posts) { postNums.push(posts[i].num); }
	
	var match = {$match : {postNum: {$in : postNums} }  };
	var group = {$group : {_id : '$postNum' ,count : {$sum: 1} }  };
	var sort = {$sort : {_id: 1} };
	
	
	_db.aggregate([match, group, sort])
	   .exec(H.getCallbackTemplate(doneOrErrFn));
};



/* helper */		
