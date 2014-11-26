/**
 * TODO:Transaction의 내부에서만 cancle이 사용되어 각 부분클래스는 deprecated 됨.
 *      그래서 현재 테스트는 확인되지 않음.
 */
process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId
var	RemoveCancler = require('../../../../dao/util/transaction/RemoveCancler.js')

var should = require('should')
  , _ = require('underscore')
  , H = require('../../../testHelper.js')
  , Done = H.Done
var User = require('../../../../domain/User.js')
  , Category = require('../../../../domain/blogBoard/Category.js')
  , userDAO = require('../../../../dao/userDAO.js')
  , categoryDAO = require('../../../../dao/blogBoard/categoryDAO.js')
  
describe('Transaction', function() {
	var user = User.createBy({_id:'user', name:'name'})
	  , user2 = User.createBy({_id:'user2', name:'name'})
	var category1 = Category.createBy({title:'title1'})  
	  , category2 = Category.createBy({title:'title2'})  
	
	var createdCategoryId;  
	before(function (nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			H.all4promise([ 
			                [userDAO.insertOne, user], [userDAO.insertOne, user2]
			              , [categoryDAO.insertOne, category1], [categoryDAO.insertOne, category2]
			             ])
			 .then(function dataFn(args) {
				 var createdCategoryId = args[3].id
				 nextTest()
			 })
			 .catch(H.testCatch1(nextTest))
		})
	})
	after(function(nextTest) {
		var errFn = H.testCatch1(nextTest);
//		console.log('after all remove------------------')
		H.all4promise([userDAO.removeAll, categoryDAO.removeAll])
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(errFn);
	});
	it('should success by removeCancle', function (nextTest) {
		var originRemove = mongoose.Model.remove
		  , originCreate = mongoose.Model.create
		  , originFind = mongoose.Model.find
		  , removeCancler = new RemoveCancler([], originRemove, originFind, originCreate)
		
		mongoose.Model.remove = removeCancler.hookFn()

//3가지 결과는같음		
//1		H.call4promise(userDAO.removeById, user._id)
//2		H.all4promise([ [userDAO.removeById, user._id], [userDAO.removeById, user2._id] ] )
		H.call4promise(userDAO.removeAll)
		 .then(function dataFn(status) {
			 return H.call4promise([removeCancler, removeCancler.cancle])
		 })
		 .then(function (status) {
			 should.equal(status.isSuccess(), true)
			 nextTest()
		 })
		 .catch(H.testCatch1(nextTest))
	})
	it('should insert _id when call cancle', function (nextTest) {
		var originRemove = mongoose.Model.remove
		, originCreate = mongoose.Model.create
		, originFind = mongoose.Model.find
		, removeCancler = new RemoveCancler([], originRemove, originFind, originCreate)
		
		mongoose.Model.remove = removeCancler.hookFn()
		
		H.call4promise(categoryDAO.removeAll)
		.then(function dataFn(status) {
			should.equal(status.isSuccess(), true)
			return H.call4promise([removeCancler, removeCancler.cancle])
		})
		.then(function (status) {
			should.equal(status.isSuccess(), true)
			
			return H.call4promise(categoryDAO.findById, createdCategoryId)
		})
		.then(function (category){
			should.equal(category.id, createdCategoryId)
			nextTest()
		})
		.catch(H.testCatch1(nextTest))
	})
});
