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
	done.hook4dataFn(User.createBy);
	var where = where || {}
		,select = select || {}
		,callback = done.getCallback();
	  _db.find(where,select).exec(callback);
};
userDAO.findByIds = function (done, ids) {
	var where = {'_id': {$in : ids}}
		,select = select || {};
		
	userDAO.find(done, where, select)
}
userDAO.findById = function (done, id) {
	done.hook4dataFn(User.createBy);
	var where = {'_id': id}
		,select = select || {}
		,callback = done.getCallback();
		
	_db.findOne(where,select).exec(callback);
};

// TODO:현재사용안함 비밀번호 필요시 다시볼것
userDAO.findByUser = function (done, loginUser) {
	var loginId = loginUser.getId()
	  , loginPw = loginUser.getPassword();
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn() || function() {};// 에러무시.
	
	if(!(H.exist([loginId,loginPw]))) return dataFn('loging user need id and pw');
	
	H.call4promise(userDAO.findById, loginId)
	 .then(function(data) {
		 if(!(H.exist(data))) {
			 return dataFn('not found by id : ' +loginId);
		 } 
		 
		 var user = User.createBy(data)
		   , pw = user.getPassword();
		 
		 if(!(loginPw == pw)) 
			 return dataFn('pw is fail');
		 else
			 dataFn(user);
	 }) 
	 .catch(errFn);
}

userDAO.findOrCreateByUser = function (done, loginUser) {
	done.hook4dataFn(User.createBy);
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	H.call4promise(userDAO.findById, loginUser.getId())
	 .then(function (data) {
		 if(!(H.exist(data)) ) { return userDAO.insertOne(done, loginUser); }
		 
		 var user = User.createBy(data);
		 console.log('user insert db ;'+ JSON.stringify(user));
		 dataFn(user);
	 })
	 .catch(errFn);
};
/* insert */
userDAO.insertOne = function(done, user) {
	done.hook4dataFn(User.createBy);
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	H.call4promise([_create], user)
	 .then(function(data) {
		 var user = User.createBy(data);
		 dataFn(user);
	 })
	 .catch(errFn);
	
	function _create(done, user) {
		_db.create(user, done.getCallback());
	}
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



/* helper */		
