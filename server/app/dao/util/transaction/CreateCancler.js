var _ = require('underscore')
var H = require('../../../common/helper')
var Q = require('q')

var Status = require('../../../common/Status')

var CreateCancler = module.exports = function (orderedCancleList, originCreate, originRemove) {
	this.cancleList = orderedCancleList
	this.statuses = []
	this.originRemove = originRemove
	this.originCreate = originCreate
} 

var count =0;
CreateCancler.prototype.hookFn = function () {
	var self = this
	  , originCreate = this.originCreate
	return function create4transaction(doc, callback) {
		return originCreate.call(this, doc, self.wrappedCallback1(this, callback))
	}
}
//remove
CreateCancler.prototype.wrappedCallback1  =  function (context, originCallback) {
	var self = this
	  , originRemove = this.originRemove
	
	return function wrappedCallback (err, data) {
		if(err) {
			self.statuses.push(Status.makeError(err))
		} else {
			self.statuses.push(Status.makeSuccess())
			where = {'_id' : data._id}
//			console.log('create id', data.id ? data.id : data._id)
			self.cancleList.push(_cancleByRemove3(context, originRemove, where) ) //all4promise의 arg
		}
		return originCallback(err, data);
	}
}
function _cancleByRemove3(context, originRemove, where) {
	return function _cancleByRemove() {
		var deferred  = Q.defer()
	      , callback  = H.cb4mongo1(deferred);
		
//		console.log('cancle remove id', where)
		originRemove.call(context, where, callback) //this가 _db임
		
		return deferred.promise.then(function (data) {
									return Status.makeForRemove(data)
								})
	}
}


//deprecated
//CreateCancler.prototype.cancle = function () {
//	var deferred  = Q.defer()
//      , callback  = H.cb4mongo1(deferred);
//	
//	var cancleList = this.cancleList
//	  
//	if(_.isEmpty(cancleList)) deferred.resolve(Status.makeSuccess('not exit cancleList about crate') );
//	
//	var statuses = []
//
//	//아마..역순.
//	_.reduceRight(cancleList, function(p, cancleFn) {
//		return p.then(function(status) {
//			statuses.push(status)
//			return cancleFn()
//		})
//	},Q())
//	.then(function() { statuses.shift() })
//    .then(function () {
//    	deferred.resolve(Status.reduceOne(statuses));
//    })
//   	.catch(function (err){
//   		deferred.resolve(Status.makeError(err));
//    })
//	
//	return deferred.promise
//}