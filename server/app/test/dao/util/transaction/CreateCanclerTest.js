/**
 * TODO:만약 cancle이 실패하면 어떻게 해야하지???
 */
process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
var	CreateCancler = require('../../../../dao/util/transaction/CreateCancler.js')

var Q 	   = require('q')
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
		userDAO.removeAll()
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(H.testCatch1(nextTest));
	});
	it('should success by create', function (nextTest) {
		var originCreate = mongoose.Model.create
		  , originRemove = mongoose.Model.remove
		  , createCancler = new CreateCancler([], originCreate, originRemove)
		  
		mongoose.Model.create = createCancler.hookFn()
		
		var user = User.createBy({_id:'user', name:'name'})
		  , user2 = User.createBy({_id:'user2', name:'name'})
		
		Q.all([ userDAO.insertOne(user), userDAO.insertOne(user2) ] )
		 .then(function dataFn() {
			 return createCancler.cancle()
		 })
		 .then(function (status) {
			 console.log(status)
			 should.equal(status.isSuccess(), true)
			 nextTest()
		 })
		 .catch(H.testCatch1(nextTest))
	})
});
