/**
 * 
 */

var _ = require('underscore')
  , should = require('should')
  , Q = require('q')
var localFile = require('../../../common/file/localFile.js')
  , H = require('../../testHelper')
  
var folder = __dirname;
describe('localFile', function() {
	var filePath = folder + '/temp.txt'
	  , dataInFile = '2222lmfelwm3ㅎㅈㄷㅎㄷㅈㅎ w3 3g';
	
	var toDeleteFiles = [] ;
	var toDeleteFolders = []; 
	after(function (nextTest) {
		
		_.reduce(toDeleteFiles, function(p, filePath){
			return p.then(function() {
							return localFile.delete(filePath)
					})
		},Q())
		.then(function() {
			_.reduce(toDeleteFolders, function(p, dir){
				return p.then(function() {
								return localFile.deleteOneFolder(dir)
						})
			},Q())			
		})
		.then(function(){nextTest()})
		.catch(H.testCatch1(nextTest))
		
	})
	describe('#createDir', function() {
		it('should create dir if dosent exist folder', function (nextTest) {
			var newFolder = folder+'\\'+'folder1' + '\\folder2' +'\\folder3'
			//삭제는 그냥 순서대로하자...
			toDeleteFolders.push(folder+'\\'+'folder1' + '\\folder2' +'\\folder3');
			toDeleteFolders.push(folder+'\\'+'folder1' + '\\folder2');
			toDeleteFolders.push(folder+'\\'+'folder1');
			
			localFile.createFolderIfNotExist(newFolder, nextFn);
			function nextFn() {
				localFile.exists(newFolder)
				.then(function dataFn(existFolder) {
					should.equal(existFolder, true); //위에서 만들었으니까.
				})
				.then(function(){nextTest()})
				.catch(H.testCatch1(nextTest))
			}
		});
	})
	describe('#createFile', function() {
		it('새 파일을 만들고 다음동작을할수있다.', function(nextTest) {
			localFile.create(filePath, dataInFile)
			.then(function dataFn(status) {
				var url = status.filePath
				toDeleteFiles.push(url)
				should.equal(status.isSuccess(), true)
				
				should.equal(url , filePath);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('새 파일을 만들 때 폴더가 없다면 새로 만든다.', function(nextTest) {
			var newFileUrl = folder +'\\'+ 'newFolder' +'\\'+ 'fileName.txt'
			localFile.createEx(newFileUrl, dataInFile)
			.then(function dataFn(status) {
				var url = status.filePath
				toDeleteFiles.push(url)
				toDeleteFolders.push(folder +'\\'+ 'newFolder')
				
				should.equal(status.isSuccess(), true)
				should.equal(url , newFileUrl);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	})
	describe('#exists', function() {
		it('이미 파일이 있는지 확인', function(nextTest) {
			localFile.exists(filePath)
			.then(function dataFn(existFile) {
				should.equal(existFile, true); //위에서 만들었으니까.
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('파일존재확인 이상한경로를 사용', function(nextTest) {
			localFile.exists('c:\\wef\\wrnk.txt')
			.then(function dataFn(existFile) {
				should.equal(existFile, false); //위에서 만들었으니까.
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	})
	describe('#read', function() {
		it('읽기', function(nextTest) {
			localFile.read(filePath)
			.then(function dataFn(data) {
				should.equal(data, dataInFile); //위에서 만들었으니까.
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
	})
	describe('#copy', function() {
		it('복사하기', function(nextTest) {
			var from = filePath
			  , to = H.pushInMidOfStr(from, 1, '.');
			localFile.copy( from, to)
			.then(function dataFn(status) {
				var url = status.filePath
				toDeleteFiles.push(url)
				should.equal(status.isSuccess(), true)
				
				should.equal(url , to);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
		it('should not copy if emptyFile', function(nextTest) {
			var from = 'wrongPath'
			, to = H.pushInMidOfStr(from, 1, '.');
			localFile.copyNoThrow(from, to)
			.then(function dataFn(status) {
				should.equal(status.isError() , true);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
		it('복사하되 from이 이미 있다면 다른 이름으로 만든다', function(nextTest) {
			var from = filePath
			  , to = filePath;
			localFile.copyNoDuplicate(from, to)
			.then(function dataFn(status) {
				var url = status.filePath
				toDeleteFiles.push(url)
				should.equal(status.isSuccess(), true)
				
				should.equal(url , H.pushInMidOfStr(to, 2, '.'));
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	})
	describe('delete', function () {
		it('폴더를 지운다. 파일이 없는 경우.', function (nextTest) {
			var emptyFolder = folder + '/fff';
			localFile.createFolderIfNotExist(emptyFolder, function () {
				localFile.deleteOneFolder(emptyFolder)
				.then(function dataFn(status) {
					should.equal(status.isSuccess(), true)
				})
				.then(function(){nextTest()})
				.catch(H.testCatch1(nextTest))
			})
		})
		it('폴더를 지울때 파일이 있다는 오류가 난다면 에러를 무시하고 리턴.', function (nextTest) {
			var folderHasFile = folder;
			localFile.deleteOneFolder(folderHasFile)
			.then(function dataFn(status) {
				should.equal(status.isSuccess(), true)
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
		it('파일을 지울때 없는 파일이라면 무시.', function (nextTest) {
			var filePath = folder + '\\a223r23f23.txt'
			localFile.delete(filePath)
			.then(function dataFn(status) {
				should.equal(status.isSuccess(), true)
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		})
	})
})
