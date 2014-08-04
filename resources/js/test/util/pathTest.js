/**
 * 
 */

var expect = chai.expect;

var utilPackage = $$namespace.package('com.kang').package('util')
  , log = utilPackage.import('log')
  , path = utilPackage.import('path');


describe('path', function() {
	describe('common' , function () {
		it('#isServer', function () {
			expect(path.isServer()).to.equal(false);
		})
		it('#isLocal', function () {
			expect(path.isLocal()).to.equal(true);
		})
	});
	
	describe('transform path in common', function () {
		it('should transform with a.js', function () {
			expect(path.trasformPostfix('a')).to.equal('a.js')
		})
	})
	describe('transform path if local path', function () {
		it('should get name and dirpath', function () {
			expect(path.getName('../welkfn/awefwef.js')).to.equal('awefwef.js')
			expect(path.getName('/awefwef.js')).to.equal('awefwef.js')
			expect(path.getName('awefwef.js')).to.equal('awefwef.js')
			
			expect(path.getDirPath('awefwef.js')).to.equal('/')
			expect(path.getDirPath('a/f/wef.js')).to.equal('/a/f/')
			expect(path.getDirPath('../../../a/f/wef.js')).to.equal('/../../../a/f/')
		})
		it('should merge dirpath and localDir', function () {
			expect(path.mergeDir('../../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/ewnk')
			expect(path.mergeDir('../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/ewnk')
			expect(path.mergeDir('./ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/testsWeb/ewnk')
			expect(path.mergeDir('/ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/testsWeb/ewnk')
			expect(path.mergeDir('ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/testsWeb/ewnk')
		})
		it('should get localPaht', function () {
			expect(path.getLocal('../../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/ewnk/es.js')
			expect(path.getLocal('../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/ewnk/es.js')
			expect(path.getLocal('./ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/testsWeb/ewnk/es.js')
			expect(path.getLocal('/ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/testsWeb/ewnk/es.js')
			expect(path.getLocal('ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/testsWeb/ewnk/es.js')
		})
	})
	describe('transform path in server', function () {
		it('should get path that is abs path using server', function() {
			expect(path.getServer('/wef/w.js')).to.equal('/wef/w.js')
			expect(path.getServer('wef/w.js')).to.equal('/wef/w.js')
			expect(path.getServer('wef/w')).to.equal('/wef/w.js')
		})
	})
})