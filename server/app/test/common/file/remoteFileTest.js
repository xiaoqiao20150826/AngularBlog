/**
 *  테스트는 app/test/remoteRun.sh로 해야한다. config때문에...
 *  너무오래걸려...
 */

var _ = require('underscore')
  , should = require('should');

var remoteFile = require('../../../common/file/remoteFile.js')
  , H = require('../../testHelper')
  , Done = H.Done;


describe('remoteFile', function () {
	this.timeout(30000) // timeout setting

	var insertedFileInfo= null
	
	it('$save', function (nextTest) {
		var fromFilePath = __dirname + '/' + 'test.jpg'
		  , toFilePath = 'userId/test'
		var userId = 'userId'
			
		remoteFile.save( fromFilePath, toFilePath, userId)
		 .then(function (status) {
//			 console.log(fileInfo)
			 insertedFileInfo = status.fileInfo; // 아래서 삭제시 사용하기 위함.
//			 should.equal(fileInfo.name, 'test')
		 })
		 .then(function(){nextTest()})
		 .catch(H.testCatch1(nextTest))
	})
	it('remove', function (nextTest) {
		var id = insertedFileInfo.id
//		console.log(id)
		
		remoteFile.removeByIds( id)
		 .then(function (status) {
			 should.equal(status.isSuccess(), true)
		 })
		 .then(function(){nextTest()})
		 .catch(H.testCatch1(nextTest))		
	})
	describe('remove many',function () {
		this.timeout(30000) // timeout setting
		
		var ids = []
		var userId = 'userId'
		beforeEach(function (nextTest) {
			var fromFilePath = __dirname + '/' + 'test.jpg'
			  , fromFilePath2 = __dirname + '/' + 'test2.jpg'
			  , toFilePath = 'userId/test'
			  , toFilePath2 = 'userId/test2'
				  
			remoteFile.save( fromFilePath, toFilePath, userId)
		  	 .then(function (status) {
		  		 ids.push(status.fileInfo.id)
				 return	remoteFile.save( fromFilePath2, toFilePath2, userId)
			 })
			 .then(function (status){
				 ids.push(status.fileInfo.id)
			 })
			 .then(function(){nextTest()})
			 .catch(H.testCatch1(nextTest))
		})
		
		it('should remove By UserId', function (nextTest) {
			
			remoteFile.removeByUserId( userId)
			.then(function (status) {
//				console.log(status)
				should.equal(status.isSuccess(), true)
			 })
			 .then(function(){nextTest()})
			 .catch(H.testCatch1(nextTest))
		})
		it('should remove By Ids', function (nextTest) {
			
			remoteFile.removeByIds( ids)
			.then(function (status) {
//				console.log(status)
				should.equal(status.isSuccess(), true)
			 })
			 .then(function(){nextTest()})
			 .catch(H.testCatch1(nextTest))
		})
	})
})