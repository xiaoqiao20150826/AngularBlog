/**
 * 
 */
var expect = chai.expect
  , _ = _;

var log = log;

describe('namespace', function() {
	var modulePaths = [
	                   './testForModuleLoaderTest.js'
	                 , './testForModuleLoaderTest2.js'
	                   ]
	it('should exist namespace', function () {
		expect($$namespace ? true : false).to.equal(true);
	})
	it('should run to load modules', function(nextTest) {
		$$namespace.load(modulePaths, done);
		function done(require) {
//			log(exportedModules)
			var testForModuleLoaderTest = require('testForModuleLoaderTest')
			expect(testForModuleLoaderTest.aa.a).to.equal(1)
			nextTest()
		}
	})
	it('should replay to load modules', function(nextTest) {
		modulePaths.push('./testForModuleLoaderTest3.js')
		modulePaths.push('./testForNamespace.js')
		$$namespace.load(modulePaths, done);
		function done(require) {
			var testForModuleLoaderTest = require('./testForModuleLoaderTest3.js')
//			log(exportedModules)
			expect(testForModuleLoaderTest.k.name).to.equal('k')
			nextTest()
		}
	})
})
