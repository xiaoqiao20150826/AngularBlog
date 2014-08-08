/**
 * 
 */
var expect = window.chai.expect
  , _ = window._;

var log = window.log;

var moduleStatus = window.moduleStatus;

describe('moduleStatus', function () {
	moduleStatus.removeAll();
	var paths = ['resources/js/test/lib/chai/wef.js', 'resources/js/test/lib/chai/chai.js','resources/js/test/lib/underscore/_.js'];
	var path  = '../a/b/c/path.js/'
	var packagePath = 'com.kang.js.test.lib.chai.chai.js';
	it('#start no duplication set path', function () {
//		moduleStatus.start(path)
		moduleStatus.start(paths)
		moduleStatus.start(paths)
		moduleStatus.start(paths)
		moduleStatus.start('wefewf')
		moduleStatus.start('wefewf')
		moduleStatus.start('.wef.ef') 
		moduleStatus.start('.wef.ef')
		var count = _.keys(moduleStatus.getModuleStatuses()).length
		expect(count).to.equal(5);
		expect(moduleStatus.currentStatus().status).to.equal('')
	})
	it('#getBy', function () {
		var moduleStatusObject = moduleStatus.getModuleStatus(packagePath)
		expect(moduleStatusObject.path).to.equal(paths[1]);
		
		expect(moduleStatus.getStatus(packagePath)).to.equal('start')
		expect(moduleStatus.getPath(packagePath)).to.equal(paths[1])
		
		
	})

	
})