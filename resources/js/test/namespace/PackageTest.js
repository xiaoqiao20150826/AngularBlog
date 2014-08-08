/**
 * 
 */


var expect = chai.expect
  , _ = _;

var log = log;

var makePackage = window.package;

describe('pacakge', function() {
	var package = makePackage;
	var modulePaths = [
	                   './namespace/testForModuleLoaderTest.js'
	                 , './namespace/testForModuleLoaderTest2.js'
	                   ]
	it('should exist package', function () {
		expect(package ? true : false).to.equal(true);
	})
	it('should make package', function() {
		var aPackage = package('com.kang').package('b.a')
		expect(com.kang.b.a ? true : false).to.equal(true);
		expect(aPackage.packageName).to.equal('com.kang.b.a')
	})
	it('should run with export ', function() {
		var module = {name:'module'};
		var aPackage = package('com.kang').package('b.a')
		aPackage.export.module = module;
		expect(com.kang.b.a.module).to.equal(module);
	})
	describe('#import', function () {
		it('should take module if find ', function() {
			//위에서 export 한것 사용하자.
			com.kang.b.a.module;
			var module = package('com.kang').package('b.a').import('module');
			expect(module.name).to.equal('module');
		})
		it('should throw err if dont find modulePaths', function () {
			
		})
	})
	
})
