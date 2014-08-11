/**
 * 
 */

var $$namespace = $$namespace || namespace //test용

$$namespace.include(function () {
	var a = this.require('./namespace/testForModuleLoaderTest.js')
	this.exports.k = function k() {}
	this.exports.kk = [1,2,3]
}, 't3')

//@ sourceURL=test/namespace/testForModuoleLoading3.js