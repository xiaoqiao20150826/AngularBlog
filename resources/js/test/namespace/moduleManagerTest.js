/**
 * 
 */
var expect = window.chai.expect
  , _ = window._;

var log = window.log;

var moduleManager = window.moduleManager;

describe('moduleManager', function () {
	var paths = ['resources/js/test/lib/chai/wef.js', 'resources/js/test/lib/chai/chai.js','resources/js/test/lib/underscore/_.js'];
	var path  = '../a/b/c/path'
	var modulePathOne = 'com/kang/js/test/lib/chai/chai';
	it('#start no duplication set path', function () {
		moduleManager.removeAll();
		moduleManager.modulePaths = paths;
//		moduleManager.start(path)
		moduleManager.start(paths)
		moduleManager.start(paths)
		moduleManager.ready(paths)
		var count = Object.keys(moduleManager.getModules()).length
		expect(count).to.equal(3);
		expect(moduleManager.getCurrentStatus().status).to.equal('emptyStatus')
	})
	it('#getModule', function () {
		var module = moduleManager.getModule(modulePathOne)
		var status = moduleManager.getStatus(modulePathOne)
		var path = moduleManager.getPath(modulePathOne)
		expect(module.getPath()).to.equal(paths[1]);
		expect(module.getPath()).to.equal(path);
		expect(status).to.equal('ready')
	})
	it('#getModulePathsByStatus', function () {
		var modulePaths = moduleManager.getModulePathsByStatus(Module.Status.READY);
		expect(modulePaths.length).to.equal(paths.length)
	})
	describe('#getModule', function() {
		it('should all modules', function () {
			var modulePath1 = '../a/aa.js';
			var modulePath2 = '../a/bb.js';
			moduleManager.removeAll();
			moduleManager.modulePaths = [modulePath1, modulePath2]
			moduleManager.success(modulePath1, function aa() {});
			moduleManager.success(modulePath2, function bb() {});
			var loadedModules = moduleManager.getModules()
			expect(loadedModules[modulePath1] ? true : false).to.equal(true)
			
			var loadedModule = moduleManager.getModule(modulePath2);
			expect(loadedModule.getModuleToRun().name).to.equal('bb');
		})
	})
	

})