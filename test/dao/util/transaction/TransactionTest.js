/**
 * 
 */
process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
var	Transaction = require('../../../../dao/util/transaction/Transaction.js')

var should = require('should')
  , _ = require('underscore')
  , H = require('../../../testHelper.js')
  , Done = H.Done
var User = require('../../../../domain/User.js')
  , userDAO = require('../../../../dao/userDAO.js')

describe('Transaction', function() {
	before(function (nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			nextTest()
		})
	})
	after(function(nextTest) {
		var errFn = H.testCatch1(nextTest);
		
		H.call4promise(userDAO.removeAll)
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(errFn);
	});
	it('should success by insert', function (nextTest) {
		var tran = new Transaction();

		tran.start()
		
		should.equal(mongoose.Model.create.name, 'create4transaction')
		
		var user = User.createBy({_id:'user', name:'name'})
		  , user2 = User.createBy({_id:'user2', name:'name'})
		
		H.all4promise([ [userDAO.insertOne, user], [userDAO.insertOne, user2] ] )
		 .then(function dataFn(args) {
			 should.equal(args[1]._id, 'user2')
			 return H.call4promise([tran, tran.rollback])
		 })
		 .then(function (status) {
			 should.equal(status.isSuccess(), true)
			 nextTest()
		 })
		 .catch(H.testCatch1(nextTest))
		
		tran.end()
		
		should.equal(mongoose.Model.create.name, 'create')
	})
});
