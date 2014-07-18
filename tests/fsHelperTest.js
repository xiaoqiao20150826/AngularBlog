/**
 * 
 */

var _ = require('underscore')
  , should = require('should');

var fsHelper = require('../common/fsHelper.js')
  , H = require('./testHelper')
  , Done = H.Done;
  
var folder = __dirname;
describe('fsHelper', function() {
	var fileUrl = folder + '/temp.txt'
	  , dataInFile = '2222lmfelwm3ㅎㅈㄷㅎㄷㅈㅎ w3 3g';
	
	var catch1 = H.testCatch1;
	var toDeleteFiles = [] ;
	
	after(function (nextTest) {
		H.asyncLoop(toDeleteFiles ,fsHelper.delete, new Done(dataFn, catch1(nextTest)));
		function dataFn() {
			 nextTest();
		}
	})
	describe('#create', function() {
		it('새 파일을 만들고 다음동작을할수있다.', function(nextTest) {
			fsHelper.create(new Done(dataFn, catch1(nextTest)), fileUrl, dataInFile)
			function dataFn(url) {
				toDeleteFiles.push(url)
				should.equal(url , fileUrl);
				nextTest();
			}
		});
	})
	describe('#exists', function() {
		it('이미 파일이 있는지 확인', function(nextTest) {
			fsHelper.exists(new Done(dataFn), fileUrl)
			function dataFn(existFile) {
				should.equal(existFile, true); //위에서 만들었으니까.
				nextTest();
			}
		});
	})
	describe('#read', function() {
		it('읽기', function(nextTest) {
			fsHelper.read(new Done(dataFn, catch1(nextTest)), fileUrl);
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
			fsHelper.copy(new Done(dataFn, catch1(nextTest)), from, to);
			function dataFn(url) {
				toDeleteFiles.push(url);
				should.equal(url , to);
				nextTest();
			}
		})
		it('복사하되 from이 이미 있다면 다른 이름으로 만든다', function(nextTest) {
			var from = fileUrl
			  , to = fileUrl;
			fsHelper.copyNoDuplicate(new Done(dataFn, catch1(nextTest)), from, to)
			function dataFn(url) {
				toDeleteFiles.push(url);
				should.equal(url , H.pushInMidOfStr(to, 2, '.'));
				nextTest();
			}
		});
	})
})
