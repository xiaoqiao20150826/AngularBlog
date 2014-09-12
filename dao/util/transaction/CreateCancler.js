var _ = require('underscore')
var H = require('../../../common/helper')

var Status = require('../../../common/Status')

var CreateCancler = module.exports = function (orderedCancleList, originCreate, originRemove) {
	this.cancleList = orderedCancleList
	this.statuses = []
	this.originRemove = originRemove
	this.originCreate = originCreate
} 

//deprecated
CreateCancler.prototype.cancle = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  , cancleList = this.cancleList
	  
	if(_.isEmpty(cancleList)) return dataFn(Status.makeSuccess('not exit cancleList about crate'))
	
	console.log(cancleList)
	return H.all4promise(cancleList)
	        .then(function (statuses) {
	        	return dataFn(Status.reduceOne(statuses))
	        })
	       	.catch(function (err){
	        	return errFn(Status.makeError(err))
	        })
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
			self.cancleList.push([ [context, _cancleByRemove1(originRemove)], where ]) //all4promise의 arg
		}
		return originCallback(err, data);
	}
}
function _cancleByRemove1(originRemove) {
	return function _cancleByRemove(done, where) {
//		console.log('cancle remove id', where)
		done.hook4dataFn(function (data) {
			return Status.makeForRemove(data)
		})
		originRemove.call(this, where, done.getCallback() ) //this가 _db임
	}
}