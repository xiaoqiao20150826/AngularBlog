/**
 * TODO:Transaction의 내부에서만 cancle이 사용되어 각 부분클래스는 deprecated 됨.
 *      그래서 현재 테스트는 확인되지 않음.
 */
process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
var	UpdateCancler = require('../../../../dao/util/transaction/UpdateCancler.js')

var should = require('should')
  , _ = require('underscore')
  , H = require('../../../testHelper.js')
  , Done = H.Done
var User = require('../../../../domain/User.js')
  , userDAO = require('../../../../dao/userDAO.js')
  
describe('UpdateCancler', function() {
	var user = User.createBy({_id:'user', name:'name1'})
	  , user2 = User.createBy({_id:'user2', name:'name2'})
	
	before(function (nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			H.all4promise([ 
			                [userDAO.insertOne, user], [userDAO.insertOne, user2]
			             ])
			 .then(function dataFn(args) {
				 nextTest()
			 })
			 .catch(H.testCatch1(nextTest))
		})
	})
	after(function(nextTest) {
		var errFn = H.testCatch1(nextTest);
		H.all4promise([userDAO.removeAll])
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(errFn);
	});
	it('should success by updateCancle', function (nextTest) {
		var originUpdate = mongoose.Model.update
		  , originCreate = mongoose.Model.create
		  , originFind = mongoose.Model.find
		  , updateCancler = new UpdateCancler([], originUpdate, originFind)
		
		mongoose.Model.update = updateCancler.hookFn()

		
		var user4update = H.deepClone(user)
		user4update.name='updateName'
		H.call4promise(userDAO.update, user4update)
		 .then(function dataFn(status) {
			 should.equal(status.isSuccess(), true)
			 return H.call4promise([updateCancler, updateCancler.cancle])
		 })
		 .then(function (status) {
			 should.equal(status.isSuccess(), true)
			 return H.call4promise(userDAO.findById, user._id)
		 })
		 .then(function (updatedUser) {
			 should.equal(updatedUser.name, user.name)
			 nextTest()
		 })
		 .catch(H.testCatch1(nextTest))
	})
});
