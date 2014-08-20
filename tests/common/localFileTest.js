/**
 * 
 */

var _ = require('underscore')
  , should = require('should');

var localFile = require('../../common/localFile.js')
  , H = require('../testHelper')
  , Done = H.Done;
  
var folder = __dirname;
describe('localFile', function() {
	var fileUrl = folder + '/temp.txt'
	  , dataInFile = '2222lmfelwm3ㅎㅈㄷㅎㄷㅈㅎ w3 3g';
	
	var catch1 = H.testCatch1;
	var toDeleteFiles = [] ;
	var toDeleteFolders = []; 
	after(function (nextTest) {
		H.asyncLoop(toDeleteFiles ,localFile.delete, new Done(dataFn, catch1(nextTest)));
		function dataFn() {
			H.asyncLoop(toDeleteFolders ,localFile.deleteOneFolder, new Done(dataFn, catch1(nextTest)));
			function dataFn() {
				nextTest()
			}
		}
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
				localFile.exists(new Done(dataFn), newFolder)
				function dataFn(existFolder) {
					should.equal(existFolder, true); //위에서 만들었으니까.
					nextTest();
				}
			}
		});
	})
	describe('#createFile', function() {
		it('새 파일을 만들고 다음동작을할수있다.', function(nextTest) {
			localFile.create(new Done(dataFn, catch1(nextTest)), fileUrl, dataInFile)
			function dataFn(url) {
				toDeleteFiles.push(url)
				should.equal(url , fileUrl);
				nextTest();
			}
		});
		it('새 파일을 만들 때 폴더가 없다면 새로 만든다.', function(nextTest) {
			var newFileUrl = folder +'\\'+ 'newFolder' +'\\'+ 'fileName.txt'
			localFile.createEx(new Done(dataFn, catch1(nextTest)), newFileUrl, dataInFile)
			function dataFn(url) {
				toDeleteFiles.push(url)
				toDeleteFolders.push(folder +'\\'+ 'newFolder')
				
				should.equal(url , newFileUrl);
				nextTest();
			}
		});
	})
	describe('#exists', function() {
		it('이미 파일이 있는지 확인', function(nextTest) {
			localFile.exists(new Done(dataFn), fileUrl)
			function dataFn(existFile) {
				should.equal(existFile, true); //위에서 만들었으니까.
				nextTest();
			}
		});
		it('파일존재확인 이상한경로를 사용', function(nextTest) {
			localFile.exists(new Done(dataFn), 'c:\\wef\\wrnk.txt')
			function dataFn(existFile) {
				should.equal(existFile, false); //위에서 만들었으니까.
				nextTest();
			}
		});
	})
	describe('#read', function() {
		it('읽기', function(nextTest) {
			localFile.read(new Done(dataFn, catch1(nextTest)), fileUrl);
			function dataFn(data) {
				should.equal(data, dataInFile); //위에서 만들었으니까.
				nextTest();
			}
		})
	})
	describe('#copy', function() {
		it('복사하기', function(nextTest) {
			var from = fileUrl
			  , to = H.pushInMidOfStr(from, 1, '.');
			localFile.copy(new Done(dataFn, catch1(nextTest)), from, to);
			function dataFn(url) {
				toDeleteFiles.push(url);
				should.equal(url , to);
				nextTest();
			}
		})
		it('should not copy if emptyFile', function(nextTest) {
			var from = 'wrongPath'
			, to = H.pushInMidOfStr(from, 1, '.');
			localFile.copyNoThrow(new Done(dataFn, catch1(nextTest)), from, to);
			function dataFn(url) {
				should.equal(url , null);
				nextTest();
			}
		})
		it('복사하되 from이 이미 있다면 다른 이름으로 만든다', function(nextTest) {
			var from = fileUrl
			  , to = fileUrl;
			localFile.copyNoDuplicate(new Done(dataFn, catch1(nextTest)), from, to)
			function dataFn(url) {
				toDeleteFiles.push(url);
				should.equal(url , H.pushInMidOfStr(to, 2, '.'));
				nextTest();
			}
		});
	})
	describe('delete', function () {
		it('폴더를 지운다. 파일이 없는 경우.', function (nextTest) {
			var emptyFolder = folder + '/fff';
			localFile.createFolderIfNotExist(emptyFolder, function () {
				localFile.deleteOneFolder(new Done(dataFn, catch1(nextTest)), emptyFolder)
				function dataFn(status) {
				should.equal(status.isSuccess(), true)
					nextTest()
				}
			})
		})
		it('폴더를 지울때 파일이 있다는 오류가 난다면 에러를 무시하고 리턴.', function (nextTest) {
			var folderHasFile = folder;
			localFile.deleteOneFolder(new Done(dataFn, catch1(nextTest)), folderHasFile)
			function dataFn(status) {
				should.equal(status.isError(), true)
				nextTest()
			}
		})
		it('파일을 지울때 없는 파일이라면 무시.', function (nextTest) {
			var fileUrl = folder + '\\a223r23f23.txt'
			localFile.delete(new Done(dataFn, catch1(nextTest)), fileUrl)
			function dataFn(status) {
				should.equal(status.isError(), true)
				nextTest()
			} 
		})
	})
})
