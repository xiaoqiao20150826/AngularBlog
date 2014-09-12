var _ = require('underscore')

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
			return originRemove.call(_db, where, self.wrappedCallback1(_db, callback, index))
		})
	}
}

removeCancler.prototype.wrappedCallback1  =  function (context, originCallback, index) {
	var self = this
	  , originCreate = this.originCreate
	  
	return function wrappedCallback (err, data) {
		if(err) {
			self.statusMap[index] = Status.makeError(err)
		} else {
			self.statusMap[index] = Status.makeSuccess()
			self.cancleList.push([ [context, _cancleByCreate1(originCreate)], self.tempDocList[index] ])
		}
		return originCallback(err, data);
	}
}

function _cancleByCreate1(originCreate) {
	return function _cancleByCreate(done, docs) {
		
		done.hook4dataFn(function (createdDocs) {
			if(createdDocs) return Status.makeSuccess('create');
			
			//createdDocs가 없으면??
		})
		
		// docs(리스트) 전달시 콜백에는 하나의 인자만 전달되지만.
//		   실제로는 모두 생성되었다.
		originCreate.call(this, docs, done.getCallback() ) //this가 _db임
	}
}
////deprecated
removeCancler.prototype.cancle = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  , cancleList = this.cancleList

	if(_.isEmpty(cancleList)) return dataFn(Status.makeSuccess('not exit cancleList about remove'))  
	
	return H.all4promise(cancleList)
	        .then(function (statuses) {
	        	return dataFn(Status.reduceOne(statuses))
	        })
	        .catch(function (err){
	        	return errFn(Status.makeError(err))
	        })
}