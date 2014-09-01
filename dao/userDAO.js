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
	,Done = H.Done
	,Status = require('./util/Status')
	,_db = mongoose.model('User', userSchema);

//// init
///////////////////////////////////////////////////////////////////////////

var userDAO = module.exports = {};

/* 
 * functions(싱글톤) 
 * 
 * */
/* remove */
//사용하나?
userDAO.removeOne = function (done, user) {
	var where = {_id: user._id};
	_remove(done, where)
};
userDAO.removeById = function (done, id) {
	var where = {_id: id};
	_remove(done, where)
};
userDAO.removeAll = function (done) {
	var where = {};
	_remove(done, where)
};
function _remove(done, where) {
	done.hook4dataFn(function (data) {
		return Status.makeForRemove(data)
	})
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

userDAO.findOrCreate = function (done, loginUser) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	H.call4promise(userDAO.findById, loginUser.getId())
	 .then(function (user) {
		 if(user.isAnnoymous())  
			 return H.call4promise(userDAO.insertOne, loginUser); 
		 else 
			 return user;
	 })
	 .then(function (user) {
		//반환값이 필요없는 비동기작업. 그러나 위의작업 후에 시작되야함.
		dataFn(user)
		userDAO.increaseVisitCount(Done.makeEmpty(errFn), user._id)
	 })
	 .catch(errFn);
};
/* insert */
userDAO.insertOne = function(done, user) {
	done.hook4dataFn(User.createBy);
	
	_create(done, user)
};
function _create(done, user) {
	_db.create(user, done.getCallback());
}
/* update */

userDAO.update = function(done, user) {
	var where = {_id : user._id}
	  , data = { name : user.name
			   , photo : user.photo
			   , email : user.email
			   }
	
	_update(done, where, data);
};
userDAO.increaseVisitCount = function(done, id) {
	var where = {'_id' : id}
	  , data = {$inc : {visitCount : 1}};
	
	_update(done, where, data);
};

function _update(done, where, data, config) {
	done.hook4dataFn(function (result) {
		console.log('update', result)
		return Status.makeForUpdate(result)
	})
	var config = config || {upsert: false , multi:true}//매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	  , callback = done.getCallback();
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
