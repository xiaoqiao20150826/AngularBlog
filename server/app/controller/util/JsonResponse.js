/**
 * 
 */

// res 몇가지 장식함.
var _ = require('underscore')

var JsonResponse = module.exports = function JsonResponse(res) {
	this.res = res;
}
// *** 클라이언트와 json 통신시 사용되는 공통 메시지 구조.

// 성공
JsonResponse.prototype.send = function (object) {
	if(_.isEmpty(object)) return console.error('object is empty : ' + object);
	
	var result = {isFail:false, obj: object}
	return this.res.send(JSON.stringify(result))
}

JsonResponse.prototype.sendFail 	= function (error, message) {
	message = message || '';
	if(_.isString(error)) message = error 
	
	var errObj = { error: error, message : message}
	var result = { isFail:true, obj: errObj}
	
	console.error(errObj);
	return this.res.send(JSON.stringify(result))
}
// this유지를 위해서 catch()로 호출해야함
JsonResponse.prototype.catch		= function () {
	var self = this;
	return function (err) {
		var message = _.isObject(err) ? JSON.stringify(err) : ''
		return self.sendFail(err, message)
	}
}