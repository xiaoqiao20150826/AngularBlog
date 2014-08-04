var expect = chai.expect;


var package = $$namespace.package('com.kang').package('util')
  , moduleLoader = package.import('moduleLoader')
  , log = package.import('log');

describe('moduleLoader', function() {
	it('should exist moduleLoader', function() {
	    expect(moduleLoader ? true : false).to.equal(true);
	})
	describe('#loadOne', function () {
		it('should throw err loadOne script by wrong path', function (nextTest) {
			var path = 'wrong_path.js;';
			moduleLoader.loadOne(done, path);
			function done(a, status){
				expect(status).to.equal('error')
				nextTest();
			};
		})
		it('should success load a script by right path', function (nextTest) {
			var errFn = catch1(nextTest);
			var path = './util/testForModuleLoaderTest.js';
			var result = moduleLoader.loadOne(done, path);
			function done(a,status) {
				if(status=='error') return errFn(status);
				expect(status).to.equal('success')
				nextTest();
			}
		})
	})
	describe('#loadMany', function () {
		it('should throw err load scripts by wrong paths', function (nextTest) {
			var rightPaht = './util/testForModuleLoaderTest.js'
			var paths = [rightPaht, rightPaht,rightPaht,'ewwewewe'];
			moduleLoader.loadMany(done, paths);
			function done(a, status){
				expect(status).to.equal('error')
				nextTest();
			};
		})
		it('should load scripts by paths', function (nextTest) {
			var errFn = catch1(nextTest);
			var rightPaht = './util/testForModuleLoaderTest.js'
			var paths = [rightPaht, rightPaht,rightPaht];
			moduleLoader.loadMany(done, paths);
			function done(a, status){
				if(status=='error') return errFn(status); 
				expect(status).to.equal('success');
				nextTest();
			};
		})
	})
	// 위의 테스트를 load에 대해 반복.
	describe('#load', function() {
		it('should throw err load scripts by wrong paths', function (nextTest) {
			var rightPaht = './util/testForModuleLoaderTest.js'
			var paths = [rightPaht, rightPaht,rightPaht,'ewwewewe'];
			moduleLoader.load(done, paths);
			function done(a, status){
				expect(status).to.equal('error')
				nextTest();
			};
		})
		it('should load scripts by paths', function (nextTest) {
			var errFn = catch1(nextTest);
			var rightPaht = './util/testForModuleLoaderTest.js'
			var paths = [rightPaht, rightPaht,rightPaht];
			moduleLoader.load(done, paths);
			function done(a, status){
				if(status=='error') return errFn(status); 
				expect(status).to.equal('success');
				nextTest();
			};
		})
		it('should throw err loadOne script by wrong path', function (nextTest) {
			var path = 'wrong_path.js;';
			moduleLoader.load(done, path);
			function done(a, status){
				expect(status).to.equal('error')
				nextTest();
			};
		})
		it('should success load a script by right path', function (nextTest) {
			var errFn = catch1(nextTest);
			var path = './util/testForModuleLoaderTest.js';
			var result = moduleLoader.load(done, path);
			function done(a,status) {
				if(status=='error') return errFn(status);
				expect(status).to.equal('success')
				nextTest();
			}
		})
	})
})
function catch1(nextTest) {
	return function (err,e) {
		nextTest(new Error(log(arguments)))
	}
}
