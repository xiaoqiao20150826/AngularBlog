/**
 * 
 */
var expect = chai.expect
  , _ = _;

var log = log;

var ns = $$namespace;

describe('namespace', function() {
	var module = {a:2,b:3}; 
	var moduleName = 'module';
	var modulePaths = [
	                   './namespace/testForModuleLoaderTest.js'
	                 , './namespace/testForModuleLoaderTest2.js'
	                   ]
	it('should exist namespace', function () {
		expect(ns ? true : false).to.equal(true);
	})
	it('should load modules by modulePaths', function(nextTest) {
		ns.load(modulePaths, endDone);
		function endDone(currentStatus) {
			expect(currentStatus.status).to.equal('success');
			nextTest();
		}
	})
	it('should run with package', function() {
		ns.package('com.kang')
		ns.package('com.kang').package('abcd')
		expect(com.kang ? true : false).to.equal(true);
		expect(com.kang.abcd ? true : false).to.equal(true);
	})
	it('should run with export ', function() {
		var package = ns.package('com.kang')
		var e_module = package.export[moduleName] = module;
		expect(e_module).to.equal(module);
	})
	it('should run with import ', function() {
		var package = ns.package('com.kang')
		var e_module = package.import(moduleName)
		expect(e_module).to.equal(module);
	})
})
