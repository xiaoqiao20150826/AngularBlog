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
	,Status = require('../common/Status')
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
userDAO.removeOne = function (user) {
	var where = {_id: user._id};
	return _remove(where)
};
userDAO.removeById = function (id) {
	var where = {_id: id};
	return _remove(where)
};
userDAO.removeAll = function () {
	var where = {};
	return _remove(where)
};
function _remove(where) {
	var deferred = Q.defer()
	  , promise  = deferred.promise
	  
	_db.remove(where, H.cb4mongo1(deferred));
	
	return promise.then(function (data) {
						return Status.makeForRemove(data)
				});
}
/* find */
userDAO.find = function (where,select) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred)
      , promise  = deferred.promise
      
	var where 	 = where || {}
	  , select 	 = select || {}
	  
	  _db.find(where,select).exec(callback);
	  
	return promise.then(User.createBy)  
};
userDAO.findByIds = function (ids) {
	var where = {'_id': {$in : ids}}
		,select = select || {};
		
	return userDAO.find(where, select)
}
userDAO.findById = function (id) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred)
      , promise  = deferred.promise
      
	var where = {'_id': id}
	  ,select = select || {}
		
	_db.findOne(where,select).exec(callback);
	
	return promise.then(User.createBy)
};

userDAO.findOrCreate = function (loginUser) {
	
	return userDAO.findById(loginUser.getId() )
				 .then(function (user) {
					 if(user.isAnnoymous())  
						 return userDAO.insertOne(loginUser); 
					 else 
						 return user;
				 })
				 .then(function (user) {
					userDAO.increaseVisitCount(user._id)
					return user
				 })
};
/* insert */
userDAO.insertOne = function(user) {
	return _create(user)
};
function _create(user) {
	var deferred  = Q.defer()
      , promise  = deferred.promise
      , callback  = H.cb4mongo1(deferred)
	
	_db.create(user, callback);
	
	return promise.then(User.createBy);
}
/* update */

userDAO.update = function(user) {
	var where = {_id : user._id}
	  , data = { name : user.name
			   , photo : user.photo
			   , email : user.email
			   }
	
	return _update(where, data);
};
userDAO.increaseVisitCount = function(id) {
	var where = {'_id' : id}
	  , data = {$inc : {visitCount : 1}};
	
	return _update(where, data);
};

function _update(where, data, config) {
	var deferred  = Q.defer()
      , promise  = deferred.promise
      , callback  = H.cb4mongo1(deferred)
      
	var config 	 = config || {upsert: false , multi:true}//매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	
	_db.update(where, data, config, callback);
	
	return promise.then(function (result) {  return Status.makeForUpdate(result) }); 
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
userDAO.getCount = function (where) {
	var deferred  = Q.defer()
    , callback  = H.cb4mongo1(deferred)
    , promise  = deferred.promise
    
	var where 	 = where || {}
	  
	  _db.find(where).count().exec(callback);
	  
	return promise  
}



/* helper */		
