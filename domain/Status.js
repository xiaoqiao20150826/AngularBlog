/**
 *  - dao의 update/remove를 위한 상태와 메시지를 저장.
 *   ; 이름이....이걸로 그냥 가?
 */

var _ = require('underscore')

var SUCCESS = 'success'
  , ERROR = 'error'
//all success 만들어말어?
var Status = module.exports = function Status(status, message) {
	  this.status = status;
	  this.message = message || '';
}

Status.makeError = function (message) {return new Status(ERROR, message)}
Status.makeSuccess = function (message) {return new Status(SUCCESS, message)}

Status.makeForUpdate = function (successAndFail) {
	if(_.isNumber (successAndFail)) {
		if(successAndFail == 1) return new Status.makeSuccess(SUCCESS);
		if(successAndFail == -1) return new Status.makeError(ERROR);
	}
	if(_.isObject(successAndFail)) {
		//{$set:{title:'newTitle'} 이런 값이나온다.
		return new Status.makeSuccess(SUCCESS);
	}
	
	console.error('update 값이 이 외의 상황이 나오면 어떻게 된 것일까.', arguments)
}

Status.makeForRemove = function (removeCount) {
	if(_.isNumber(removeCount)) {
		return new Status(SUCCESS, 'remove '+ removeCount);
	}
	else {
		console.error('remove 값이 이 외의 상황이 나오면 어떻게 된 것일까.', arguments)
	}
}
Status.isStatusType = function (o) {
	if(o.constructor.name && (o.constructor.name == Status.name) ) return true;
	else return false;
}

// instance methods
Status.prototype.isSuccess = function () {return this.isStatus(SUCCESS)}
Status.prototype.isError = function () {return this.isStatus(ERROR)}
Status.prototype.isStatus = function (statusName) {
	if(this.status == statusName) return true;
	else return false;
}

Status.prototype.getMessage = function () {
	var message = '['+this.status+'] : ';
	if(this.message) message = message + '[message:' + this.message + ']';
	return message;
}
Status.prototype.appendMessage = function (message) {
	if(this.message) this.message = this.message + '   '+ message
}
