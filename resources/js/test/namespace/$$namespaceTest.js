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
	it('should fail to load file', function() {
		//실패는 하는데 콘솔에만.. throw를 못잡아. 비동기라. 이럴 때는 어떻게 할까.
//		var wrongModulePath = 'wefwfe.wef/weffe/ff'
//			expect(function() {
//				$$namespace.load(wrongModulePath, done);
//			}).to.throw('');
	})
	it('should run to load modules', function(nextTest) {
		$$namespace.load(modulePaths, done);
		function done(require, exportedModules) {
//			log(exportedModules)
			expect(exportedModules[0].aa.a).to.equal(1)
			nextTest()
		}
	})
	it('should replay to load modules', function(nextTest) {
		modulePaths.push('./testForModuleLoaderTest3.js')
		modulePaths.push('./testForNamespace.js')
		$$namespace.load(modulePaths, done);
		function done(require, exportedModules) {
//			log(exportedModules)
			expect(exportedModules[0].k.name).to.equal('k')
			nextTest()
		}
	})
})
