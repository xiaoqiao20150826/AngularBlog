/**
 * 
 */

var expect = chai.expect;

var log = window.log
  , path = window.path;


describe('path', function() {
	describe('common' , function () {
		it('#isServer', function () {
			expect(path.isServer()).to.equal(false);
		})
		it('#isLocal', function () {
			expect(path.isLocal()).to.equal(true);
		})
	});
	
	describe('addExtensionJs path in common', function () {
		it('should transform with a.js', function () {
			expect(path.addExtensionJs('a')).to.equal('a.js')
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
			expect(path.mergeDir('../../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/ewnk')
			expect(path.mergeDir('../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/ewnk')
			expect(path.mergeDir('./ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk')
			expect(path.mergeDir('/ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk')
			expect(path.mergeDir('ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk')
		})
		it('should get localPaht', function () {
			expect(path.getLocal('../../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/ewnk/es.js')
			expect(path.getLocal('../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/ewnk/es.js')
			expect(path.getLocal('./ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk/es.js')
			expect(path.getLocal('/ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk/es.js')
			expect(path.getLocal('ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk/es.js')
		})
	})
	describe('transform path in server', function () {
		it('should get path that is abs path using server', function() {
			expect(path.getServer('/wef/w.js')).to.equal('/wef/w.js')
			expect(path.getServer('wef/w.js')).to.equal('/wef/w.js')
			expect(path.getServer('wef/w')).to.equal('/wef/w.js')
		})
	})
	describe('equal',function () {
		it('#equalCountOne', function () {
			var a = '../JS/tesT/Util/a.js', b = 'com.kang.util.a.js'
			expect(path.equalCountOne(a,b).count).to.equal(2);	
	    })
	    it('#equal', function () {
	    	var modulePath = 'com.kang.util.kk.a.js';
	    	var paths = ['../JS/tesT/Util/a.js', '../JS/teT/Util/a.js']
	    	expect(path.equalPath(paths,modulePath)).to.equal(paths[0]);	
	    	var paths = ['../JS/tesT/Util/a.js', '../JS/teT/Utile/a.js']
	    	expect(path.equalPath(paths,modulePath)).to.equal(paths[0]);	
	    	var paths = ['../JS/testt/Util/a.js','../JS/teste/Util/a.js','../JS/tsest/Util/aa.js','../JS/test/Util/kk/ae.js', '../JS/tesT/Util/kk/a.js']
	    	expect(path.equalPath(paths,modulePath)).to.equal(paths[paths.length-1]);	
	    })
	    it('should throw err by moduleName is not equal', function () {
	    	var a = '../JS/tesT/Util/a.js', b = 'com.kang.util.a.js'
			expect(path.equalPath(a,b).count).to.equal(2);	
	    })
	    
	})
})