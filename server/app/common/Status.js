/**
 *  
 */

var debug = require('debug')('nodeblog:common:Status')

var U = require('./util/util.js')
var _ = require('underscore')

var SUCCESS = 'success'
  , ERROR = 'error'
//all success 만들어말어?
var Status = module.exports = function Status(status, message) {
	  this.status = status || 'success';
	  
	  this.message = _saveMessage(message)
}
function _saveMessage(message) {
	if(U.notExist(message)) return ''
	
	if(_.isString(message)) return message
	if(message.stack) return message.stack
	
	return message //이경우는 뭐지.
}

Status.makeError = function (message) {return new Status(ERROR, message)}
Status.makeSuccess = function (message) {return new Status(SUCCESS, message)}

// TODO: 아래둘. 어차피 성공에 대한 dataFn의 후처리함수인데... 그냥 없에고 간단히 할까.
Status.makeForUpdate = function (successAndFail) {
	if(_.isNumber (successAndFail)) {
		if(successAndFail > 0) return new Status.makeSuccess('update '+ successAndFail);
		if(successAndFail == 0) return new Status.makeSuccess('update ' + successAndFail);
		if(successAndFail == -1) return new Status.makeSuccess('update fail '+ successAndFail); //이거실패인데...
	}
	if(_.isObject(successAndFail)) {
		//{$set:{title:'newTitle'} 이런 값이나온다.
		return new Status.makeSuccess(successAndFail);
	}
	return Status.makeSuccess('update fail ' + successAndFail)
}

Status.makeForRemove = function (removeCount) {
	debug('makeForRemove', removeCount)
	if(_.isNumber(removeCount)) {
		return Status.makeSuccess('remove '+ removeCount);
	}
	else {
		return Status.makeSuccess(removeCount);
	}
}


Status.isStatusType = function (o) {
	if(U.notExist(o)) return false;
	
	if(o.constructor.name && (o.constructor.name == Status.name) ) return true;
	else return false;
}
//단순히 메시지 축약.
Status.reduceOne = function (statuses) {
	var successStatus = Status.makeSuccess()
      , errorStatus = Status.makeError()
	  , hasError = false
	
	for(var i in statuses) {
		var status = statuses[i]
		if(!Status.isStatusType(status)) status = Status.makeError(status)
		if(status.isSuccess()) { successStatus.appendMessage(status.message) }
		if(status.isError()) {
			hasError = true
			errorStatus.appendMessage(status.message) 
		}
	}
	if(hasError) 
		return errorStatus;
	else 
		return successStatus;
}

// instance methods
Status.prototype.isSuccess = function () {return this.isStatus(SUCCESS)}
Status.prototype.isError = function () {return this.isStatus(ERROR)}
Status.prototype.isStatus = function (statusName) {
	if(this.status == statusName) return true;
	else return false;
}
Status.prototype.setError = function () { return this.status = ERROR}

Status.prototype.getMessage = function () {
	return this.status + ' : ' +this.message;
}
Status.prototype.appendMessage = function (message) {
	if(!this.message) 
		this.message = message
	else
		this.message = this.message + ' ; '+ message
		
	return this
}
Status.prototype.toJsonString = function () {
	var result = U.deepClone(this)
	result.isError = this.isError()
	result.isSuccess = this.isSuccess()
	result.message = this.getMessage()

	return JSON.stringify(result);
}
