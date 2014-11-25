/**
 * 
 */
var should = require('should')
  , _ = require('underscore')
  , debug = require('debug')('test:dao:categoryTest')
  , Q = require('q')
var H = require('../testHelper.js')
  , categoryService = require('../../service/blogBoard/categoryService.js')
  , categoryDAO = require('../../dao/blogBoard/categoryDAO.js')
  , Category= require('../../domain/blogBoard/Category.js');
var initDataCreater = require('../../initDataCreater')

var debug = require('debug')('test:dao:categoryTest');
var mongoose = require('mongoose');

describe('categoryDAO', function() {
	var categories;
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			
			initDataCreater.create()
			.then(function () {
				return Q.all([
					       	 categoryDAO.insertChild(Category.getRootId(), 'title1')
					       , categoryDAO.insertChild(Category.getRootId(), 'title2')
					       , categoryDAO.increasePostCountById( Category.getRootId() )
					      ])
			 })
			 .then(function () { nextTest() })
			 .catch(H.testCatch1(nextTest))
			
		})
	})
	after(function(nextTest) {
		var errFn = H.testCatch1(nextTest);
		Q.all([ categoryDAO.removeAll()
			  , initDataCreater.removeAll()
			  ])
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(H.testCatch1(nextTest))
	});
	describe('#find',function() {
		it('should find All', function (nextTest) {
			categoryDAO.findAll()
			.then(function dataFn(categories) {
				debug('findAll : ',categories);
				should.equal(categories.length, 3)
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		/////////// 이것만 카테고리 서비스다. 햇갈리지말것.
		describe('#categoryService',function() {
			it('should get rootOfCategoryTree', function (nextTest) {
				categoryService.getRootOfCategoryTree()
				.then(function dataFn(rootOfCategoryTree) {
					debug('rootOfCategoryTree : ',rootOfCategoryTree);
					should.equal(rootOfCategoryTree.categories[0].title , 'title1')
				})
				.then(function() {nextTest()})
				.catch(H.testCatch1(nextTest))
			});
		})
		it('should return bool from #isDuplicate', function (nextTest) {
			categoryDAO.isDuplicate( Category.getRootId(), 'title1')
			 .then(function dataFn(result) {
				should.equal(result, true);
			 })
			 .then(function() {nextTest()})
			 .catch(H.testCatch1(nextTest))
		});
		
		it('should get all child id from parentId', function (nextTest) {
			var id = Category.getRootId();
			
			categoryDAO.allIdsOf(id)
			.then(function dataFn(ids) {
				debug('category ids ', ids);
				should.equal(ids.length, 3)
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		})
		
	})
	describe('#insert',function() {
		it('should handle err if insert a category with duplicate title category have same parent', function (nextTest) {
			var parentId = Category.getRootId()
			  , title = 'title1';
			
			categoryDAO.insertChild(parentId, title)
			.then(function dataFn(status) {
				debug('insert err : ', status)
				should.equal(status.isError() , true);
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		})
		it('should insert success ChildToParentByTitle', function (nextTest) {
			var parentId = Category.getRootId()
			, title = 'title123';
			
			categoryDAO.insertChild(parentId, title)
			.then(function dataFn(category) {
				should.equal(category.title , title);
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		})
	})
	describe('#update',function() {
		it('should take errString update by already exist title', function (nextTest) {
			var categoryId = Category.getRootId()
			  , alreadyExistTitle = 'root';
			
			categoryDAO.updateTitle(categoryId, alreadyExistTitle)
			.then(function dataFn(status) {
				debug('update err : ', status.getMessage())
				should.equal(status.isError(),true);
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('should take success by new title', function (nextTest) {
			var categoryId = Category.getRootId()
			  , newTitle = 'newTitle';
			
			categoryDAO.updateTitle(categoryId, newTitle)
			.then(function dataFn(status) {
				debug('update message : ', arguments)
				should.equal(status.isSuccess(), true);
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		});
//		it('update postCount', function (nextTest) {
//			//테스트 데이터 넣을때 확인한 것으로 생략
//		})
		
	})
	describe('#delete',function() {
		it('should delete fail with category have postcount > 0', function (nextTest) {
			var categoryId = Category.getRootId()
			
			categoryDAO.removeById(categoryId)
			.then(function dataFn(status) {
				debug('delete : ',status)
				should.equal(status.isError(), true)
				should.exist(status.getMessage().match('category has post'))
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('should delete success with category', function (nextTest) {
			var parentId = Category.getRootId()
			, title = 'title12333333333333333';
			
			categoryDAO.insertChild(parentId, title)
			.then(function dataFn(_category) {
				should.equal(_category.title , title);
				return _category
			})
			.then(function (category) {
				return categoryDAO.removeById(category.id);
			})
			.then(function dataFn(status) {
				should.equal(status.isSuccess(), true)
			})
			.then(function() {nextTest()})
			.catch(H.testCatch1(nextTest))
		})
	})
	
	
})


