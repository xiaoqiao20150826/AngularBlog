/**
 * userDAO (싱글톤)
 * 
 */


//////// 참조클래스
var User = require('../domain/User.js')
	,Sequence = require('./Sequence.js')
	,Q = require('q');
var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,userSchema = new Schema(User.getSchema());

///// 참조변수
var _ = require('underscore')
	,H = require('../common/helper.js')
	,_db = mongoose.model('User', userSchema);

//// init
///////////////////////////////////////////////////////////////////////////

var userDAO = module.exports = {};

/* 
 * functions(싱글톤) 
 * 
 * */
/* remove */
userDAO.removeOne = function (done, user) {
	var where = {_id: user._id};
	_remove(done, where)
};
userDAO.removeAll = function (done) {
	var where = {};
	_remove(done, where)
};
function _remove(done, where) {
	_db.remove(where, done.getCallback());
}
/* find */
userDAO.find = function (done,where,select) {
	var where = where || {}
		,select = select || {}
		,callback = done.getCallback();
	  _db.find(where,select).exec(callback);
};
userDAO.findById = function (done, id) {
	var where = {'_id': id}
		,select = select || {}
		,callback = done.getCallback();
	_db.findOne(where,select).exec(callback);
};
/* insert */
userDAO.insertOne = function(done, user) {
	var dataFn  = done.getDataFn();
	var errFn = done.getErrFn() || function () {
		//TODO : 중복된키 처리해야하는데.
	}

	var callback = done.getCallback();
	_db.create(user, callback);
};
/* update */
//TODO: 업데이트할 데이터에 User를 통채로 주므로 업데이트 하지말아야할 데이터는 잘 걸러서 줘야한다. 
userDAO.update = function(done, user) {
	if(!(H.exist(user._id))) throw new Error('_id은 필수').stack;
	var where = {_id : user._id}
		,data = user;
	
	_update(done, where, data);
};
function _update(done, where, data, config) {
	if(!(H.exist(done))) throw new Error('done need').stack;
	//TODO: writeConcern 는 무엇을 위한 설정일까. 
	var config = config || {upsert: false , multi:true}//매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
		,callback = done.getCallback();
	_db.update(where, data, config).exec(callback);
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
userDAO.getCount = function (done, where) {
	var where = where || {}
		,callback = done.getCallback();
	_db.find(where).count().exec(callback);
}
userDAO.findOrCreate = function (endDone, user) {
	var errFn = endDone.getErrFn();
	
	userDAO.findById(new H.Done(dataFn1, errFn), user.id);
	function dataFn1(data) {
		if((H.exist(data))) 
			return done(data);
		else 
			return userDAO.insertOne(endDone, user) 
	}
};


/* helper */		
