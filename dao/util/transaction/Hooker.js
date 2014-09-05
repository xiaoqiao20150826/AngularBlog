
var H = require('../../../common/helper')
  
// 실제작업을하는 인스턴스

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