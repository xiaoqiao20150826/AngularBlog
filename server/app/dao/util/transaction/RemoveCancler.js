var _ = require('underscore')

var Q = require('q')
var H = require('../../../common/helper')
var Status = require('../../../common/Status')

var removeCancler = module.exports = function (orderedCancleList, originRemove, originFind, originCreate) {
	this.tempDocList = []
	this.cancleList = orderedCancleList
	this.statusMap = {}
	this.originRemove = originRemove
	this.originFind = originFind
	this.originCreate = originCreate
} 

removeCancler.prototype.hookFn = function () {
	var self = this
	  , originRemove = this.originRemove
	  , originFind = this.originFind
	  
	return function remove4transaction(where, callback) {
		var _db = this
		originFind.call(_db, where, function (err, datas) {
			if(err) return callback('removeCancler not find ' + err) //이게 발생하면안되는데.
			
			self.tempDocList.push(datas)
			var index = self.tempDocList.length-1;
			return originRemove.call(_db, where, self.wrappedCallback3(_db, callback, index))
		})
	}
}

removeCancler.prototype.wrappedCallback3  =  function (context, originCallback, index) {
	var self = this
	  , originCreate = this.originCreate
	  
	return function wrappedCallback (err, data) {
		if(err) {
			self.statusMap[index] = Status.makeError(err)
		} else {
			self.statusMap[index] = Status.makeSuccess()
			self.cancleList.push(_cancleByCreate3(context,originCreate, self.tempDocList[index]) )
		}
		return originCallback(err, data);
	}
}

function _cancleByCreate3(context, originCreate, docs) {
	return function _cancleByCreate() {
		var deferred  = Q.defer()
	      , callback  = H.cb4mongo1(deferred);
		
//		console.log('cancle remove id', where)
		originCreate.call(context, docs, callback) 
		
		return deferred.promise.then(function (createdDocs) {
									if(createdDocs) 
										return Status.makeSuccess('create');
									else 
										return Status.makeSuccess('no created');//createdDocs가 없으면??
								})
	}
}
////deprecated
//removeCancler.prototype.cancle = function (done) {
//	var dataFn = done.getDataFn()
//	  , errFn = done.getErrFn()
//	  , cancleList = this.cancleList
//
//	if(_.isEmpty(cancleList)) return dataFn(Status.makeSuccess('not exit cancleList about remove'))  
//	
//	return H.all4promise(cancleList)
//	        .then(function (statuses) {
//	        	return dataFn(Status.reduceOne(statuses))
//	        })
//	        .catch(function (err){
//	        	return errFn(Status.makeError(err))
//	        })
//}