
var expect = chai.expect
  , _ = window._;

var moduleLoader = window.moduleLoader
  , log = window.log

describe('moduleLoader', function() {
	it('should exist moduleLoader', function() {
	    expect(moduleLoader ? true : false).to.equal(true);
	})
	describe('#loadOne', function () {
		it('should throw err loadOne script by wrong path', function (nextTest) {
			var path = 'wrong_path.js';
			moduleLoader.loadOne(done, path);
			function done(){
				expect(moduleLoader.currentStatus().status).to.equal('error');
				nextTest();
			};
		})
		it('should success load a script by right path', function (nextTest) {
			moduleLoader.moduleStatus.removeAll();
			var errFn = catch1(nextTest);
			var path = './namespace/testForModuleLoaderTest.js';
			moduleLoader.loadOne(done, path);
			function done() {
				expect(moduleLoader.currentStatus().status).to.equal('success');
				nextTest();
			}
		})
	})
	
	describe('#loadMany', function () {
		it('should throw err load scripts by wrong paths', function (nextTest) {
			var paths = [ './namespace/testForModuleLoaderTest.js'
			            , './namespace/testForModuleLoaderTest2.js'
			            , './wef'
			            , 'we.wejj.f'
			            ];
			moduleLoader.loadMany(lastDone, paths);
			
			function lastDone(currentStatus){
				expect(moduleLoader.currentStatus().status).to.equal('error');
				nextTest();
			};
		})
		it('should load scripts by paths', function (nextTest) {
			moduleLoader.moduleStatus.removeAll();
			var paths = [ './namespace/testForModuleLoaderTest.js'
			            , './namespace/testForModuleLoaderTest2.js'
			            , './namespace/testForModuleLoaderTest2'
			            , 'namespace/testForModuleLoaderTest'
			            ];
			moduleLoader.loadMany(lastDone, paths);
			function lastDone(currentStatus){
				expect(moduleLoader.currentStatus().status).to.equal('success');
				nextTest();
			};
		})
	})
	// 위의 테스트를 load에 대해 반복.
	describe('#load', function() {
		it('should throw err loadOne script by wrong path', function (nextTest) {
			var path = 'wrong_path.js';
			moduleLoader.load(done, path);
			function done(){
				expect(moduleLoader.currentStatus().status).to.equal('error');
				nextTest();
			};
		})
		it('should success load a script by right path', function (nextTest) {
			moduleLoader.moduleStatus.removeAll();
			var errFn = catch1(nextTest);
			var path = './namespace/testForModuleLoaderTest.js';
			moduleLoader.load(done, path);
			function done() {
				expect(moduleLoader.currentStatus().status).to.equal('success');
				nextTest();
			}
		})
				it('should throw err load scripts by wrong paths', function (nextTest) {
			var paths = [ './namespace/testForModuleLoaderTest.js'
			            , './namespace/testForModuleLoaderTest2.js'
			            , './wef'
			            , 'we.wejj.f'
			            ];
			moduleLoader.load(lastDone, paths);
			
			function lastDone(currentStatus){
				expect(moduleLoader.currentStatus().status).to.equal('error');
				nextTest();
			};
		})
		it('should load scripts by paths', function (nextTest) {
			moduleLoader.moduleStatus.removeAll();
			var paths = [ './namespace/testForModuleLoaderTest.js'
			            , './namespace/testForModuleLoaderTest2.js'
			            , './namespace/testForModuleLoaderTest2'
			            , 'namespace/testForModuleLoaderTest'
			            ];
			moduleLoader.load(lastDone, paths);
			function lastDone(currentStatus){
				expect(moduleLoader.currentStatus().status).to.equal('success');
				nextTest();
			};
		})
	})
})
function catch1(nextTest) {
	return function (err,e) {
		nextTest(new Error(log(arguments)))
	}
}
