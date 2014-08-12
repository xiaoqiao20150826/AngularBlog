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
	
	describe('#extensionMustBe', function () {
		it('should transform with a.js', function () {
			expect(path.extensionMustBe('js', 'name')).to.equal('name.js')
		})
	})
	describe('#getFilePath', function () {
		it('should return if path is url', function () {
			expect(path.getFilePath('http://welkfn/awefwef.js')).to.equal('http://welkfn/awefwef.js')
		})
	})
	describe('transform path if local path', function () {
		it('should get name and dirpath', function () {
			expect(path.getModuleName('../welkfn/awefwef.js')).to.equal('awefwef.js')
			expect(path.getModuleName('/awefwef.js')).to.equal('awefwef.js')
			expect(path.getModuleName('awefwef.js')).to.equal('awefwef.js')
			
			expect(path.getDirOfModulePath('awefwef.js')).to.equal('/')
			expect(path.getDirOfModulePath('a/f/wef.js')).to.equal('/a/f/')
			expect(path.getDirOfModulePath('../../../a/f/wef.js')).to.equal('/../../../a/f/')
		})
		it('should merge dirpath and localDir', function () {
			expect(path.getLocalDirByModulePath('../../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/ewnk')
			expect(path.getLocalDirByModulePath('../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/ewnk')
			expect(path.getLocalDirByModulePath('./ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk')
			expect(path.getLocalDirByModulePath('/ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk')
			expect(path.getLocalDirByModulePath('ewnk/e.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk')
		})
		it('should get localPath', function () {
			expect(path.getLocalPath('../../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/ewnk/es.js')
			expect(path.getLocalPath('../ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/ewnk/es.js')
			expect(path.getLocalPath('./ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk/es.js')
			expect(path.getLocalPath('/ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk/es.js')
			expect(path.getLocalPath('ewnk/es.js')).to.equal('D:/java/_Workspace/work4node/NodeBlog/resources/js/test/ewnk/es.js')
		})
	})
	describe('transform path in server', function () {
		it('should get path that is abs path using server', function() {
			expect(path.getServerPath('/wef/w.js')).to.equal('/wef/w.js')
			expect(path.getServerPath('wef/w.js')).to.equal('/wef/w.js')
			expect(path.getServerPath('wef/w')).to.equal('/wef/w.js')
		})
	})
	describe('#mostSimilaireModulePath',function () {
		it('should get one ModulePathAndEqualCount', function () {
			var modulePath = '../JS/tesT/Util/a.js', modulePathOne = 'com/kang/util/a'
			expect(path.getModulePathAndEqualCountOne(modulePath, modulePathOne).equalCount).to.equal(2);	
	    })
	    it('should get equalCount 0  of ModulePathAndEqualCount  ', function () {
	    	var modulePath = '../JS/tesT/Util/e.js', modulePathOne = 'com/kang/util/a'
	    		expect(path.getModulePathAndEqualCountOne(modulePath, modulePathOne).equalCount).to.equal(0);	
	    })
	    it('should get many getModulePathAndEqualCountOne', function () {
	    	var modulePaths = ['../JS/tesT/Util/a.js', '../JS/tesT/other/a.js']
	    	  , modulePathOne = 'com/kang/util/a'
	    	expect(path.getModulePathAndEqualCountMany(modulePaths, modulePathOne)[1].equalCount).to.equal(1);	
	    })
	    it('should throw err by moduleName is not equal', function () {
	    	var modulePathOne = 'com.kang.util.kk.a';
	    	var modulePaths = ['../JS/tesT/Util/aB.js', '../JS/teT/Util/aE.js']
	    	expect(function () {
	    		path.getMostSimilaireModulePath(modulePaths,modulePathOne);
	    	}).to.throw(/not found SimilaireModulePath /);	
	    })
	    it('#getMostSimilaireModulePath', function () {
	    	var modulePathOne = 'com/kang/util/kk/a';
	    	var testModulePath1 = '../JS/tesT/Util/a';
	    	var testModulePath2 = '../JS/tesT/gnne/a.js';
	    	var modulePaths = [testModulePath1, testModulePath2];
	    	
	    	var modulePath = path.getMostSimilaireModulePath(modulePaths,modulePathOne);
	    	expect(modulePath).to.equal(testModulePath1);
	    	
	    	modulePaths.push('../JS/tesT/kk/a.js')
	    	modulePath = path.getMostSimilaireModulePath(modulePaths,modulePathOne);
	    	expect(modulePath).to.equal('../JS/tesT/kk/a.js');
	    	
	    	modulePaths.push('../JS/util/kk/a.js')
	    	modulePath = path.getMostSimilaireModulePath(modulePaths,modulePathOne);
	    	expect(modulePath).to.equal('../JS/util/kk/a.js');
	    	
	    	modulePaths.push('../JS/util/kk/a2.js')
	    	modulePath = path.getMostSimilaireModulePath(modulePaths,modulePathOne);
	    	expect(modulePath).to.equal('../JS/util/kk/a.js');
	    })
	})
})