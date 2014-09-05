var H = require('../../../common/helper')

var Status = require('../Status')

var CreateCancler = module.exports = function (originCreate, originRemove) {
	this.cancleList = []
	this.statuses = []
	this.originRemove = originRemove
	this.originCreate = originCreate
} 
CreateCancler.prototype.cancle = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  , cancleList = this.cancleList
	  
	  
	return H.all4promise(cancleList)
	        .then(function (statuses) {
	        	var returnStatus = Status.makeSuccess()
	        	for(var i in statuses) {
	        		var status = statuses[i]
	        		returnStatus.appendMessage(status.message)
	        	}
	        	dataFn(returnStatus)
	        })
	        .catch(errFn)
}
CreateCancler.prototype.hookFn = function () {
	var self = this
	  , originCreate = this.originCreate
	return function create4transaction(doc, callback) {
		return originCreate.call(this, doc, self.wrappedCallback1(this, callback))
	}
}

CreateCancler.prototype.wrappedCallback1  =  function (context, originCallback) {
	var self = this
	  , originRemove = this.originRemove
	
	return function wrappedCallback (err, data) {
		if(err) {
			self.statuses.push(Status.makeError(err))
		} else {
			self.statuses.push(Status.makeSuccess())
			where = {'_id' : data._id}
			
			self.cancleList.push([ [context, _cancleByRemove1(originRemove)], where ]) //all4promise의 arg
		}
		return originCallback(err, data);
	}
}
function _cancleByRemove1(originRemove) {
	return function _cancleByRemove(done, where) {
		done.hook4dataFn(function (data) {
			return Status.makeForRemove(data)
		})
		originRemove.call(this, where, done.getCallback() ) //this가 _db임
	}
}