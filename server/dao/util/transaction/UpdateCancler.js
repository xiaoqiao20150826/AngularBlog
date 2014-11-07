
var _ = require('underscore')

var H = require('../../../common/helper')
var Status = require('../../../common/Status')

var updateCancler = module.exports = function (orderedCancleList, originUpdate, originFind) {
	this.tempArgMapList = []
	this.cancleList = orderedCancleList
	this.statusMap = {}
	this.originUpdate = originUpdate
	this.originFind = originFind
} 

updateCancler.prototype.hookFn = function () {
	var self = this
	  , originUpdate = this.originUpdate
	  , originFind = this.originFind
	  
	return function update4transaction(where, data, config, callback) {
		var _db = this
		originFind.call(_db, where, function (err, docs) {
			if(err) return callback('updateCancler not find ' + err)
			if(_.isEmpty(docs)) return callback(null, 'not exist data to update about '+ where);
			
			var argMap = {}
			argMap.listOfWhereAndData = _listOfWhereAndData(docs)
			argMap.config = config
			self.tempArgMapList.push(argMap)
			
			var index = self.tempArgMapList.length-1;
			return originUpdate.call(_db, where, data, config, self.wrappedCallback1(_db, callback, index))
		})
	}
}
function _listOfWhereAndData (docs) {
	var result = []
	
	for(var i in docs) {
		var doc = docs[i]
		  , whereAndData = {}

		if(!doc._id) return console.err('should exist _id about find', + doc); //이게 호출되면안되는디
		
		whereAndData.where = {_id : doc._id }
		whereAndData.data = doc._doc
		delete whereAndData.data._id
		delete whereAndData.data.__v
		result.push(whereAndData)
	}
	return result;
} 

updateCancler.prototype.wrappedCallback1  =  function (context, originCallback, index) {
	var self = this
	  , originUpdate = this.originUpdate
	  
	return function wrappedCallback (err, data) {
		if(err) {
			self.statusMap[index] = Status.makeError(err)
		} else {
			
			var argMap = self.tempArgMapList[index]
			  , config = argMap.config
			  , contextAndAsyncFn  = [context, _cancleByUpdate1(originUpdate)]
			  , listOfWhereAndData = argMap.listOfWhereAndData
			
//			순서주의 (asyncFn call하기위한 args)
			for(var i in listOfWhereAndData) {
				var arg4call4promise = []
				  , whereAndData = listOfWhereAndData[i]
				arg4call4promise.push(contextAndAsyncFn)
				arg4call4promise.push(whereAndData.where)
				arg4call4promise.push(whereAndData.data)
				arg4call4promise.push(config)
				
				self.cancleList.push(arg4call4promise)
			}
			
			self.statusMap[index] = Status.makeSuccess()
		}
		return originCallback(err, data);
	}
}

// all4promise를 위한 비동기 함수
function _cancleByUpdate1(originUpdate) {
	return function _cancleByUpdate(done, where, data, config) {
		
//		console.log('update arg for cancle', where, data, config)
		done.hook4dataFn(function (result) {
			return Status.makeForUpdate(result)
		})
		originUpdate.call(this, where, data, config, done.getCallback()) //this가 _db임
	}
}
////deprecated
updateCancler.prototype.cancle = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  , cancleList = this.cancleList

	if(_.isEmpty(cancleList)) return dataFn(Status.makeSuccess('not exit cancleList about update'))
	
	return H.all4promise(cancleList)
	        .then(function (statuses) {
	        	return dataFn(Status.reduceOne(statuses))
	        })
	        .catch(function (err){
	        	return errFn(Status.makeError(err))
	        })
}