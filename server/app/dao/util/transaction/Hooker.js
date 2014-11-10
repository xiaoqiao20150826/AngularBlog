
var H = require('../../../common/helper')
  
// target의 현재시점의 함수를 후킹하고, end시 원상태로 되돌림.
var Hooker = module.exports = function Hooker(target) {
	this.target = target
	this.originFnMap = {}
}

Hooker.prototype.start = function () {
	_hookAll(Model)
}
Hooker.prototype.hook = function (fromKey, toFn) {
	this.originFnMap[fromKey] = this.target[fromKey]
	this.target[fromKey] = toFn
}
Hooker.prototype.end = function () {
	for(var key in this.originFnMap) {
		this.target[key] = this.originFnMap[key]
	}
}