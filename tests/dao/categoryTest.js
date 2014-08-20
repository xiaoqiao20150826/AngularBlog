/**
 * 
 */
var should = require('should')
  , _ = require('underscore')
  , debug = require('debug')('test:dao:categoryTest')

var H = require('../testHelper.js')
  , Done = H.Done
  , categoryService = require('../../services/categoryService.js')
  , categoryDAO = require('../../dao/categoryDAO.js')
  , Category= require('../../domain/Category.js');
var initDataCreater = require('../../initDataCreater')

var debug = require('debug')('test:dao:categoryTest');

var _title = 'gggggggggg';
describe('categoryDAO', function() {
	var mongoose = require('mongoose');
	var categories;
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertAllTestData(dataFn);
			function dataFn() {
				categoryDAO.findAll(new Done(dataFn))
				function dataFn(_categories) {
					debug('inserted categories : ',_categories)
					categories =  _categories;
					nextTest();
				}
			}
		})
	})
	after(function(nextCase) {
		var errFn = H.testCatch1(nextCase);
		H.all4promise([ categoryDAO.removeAll
			          , initDataCreater.removeAll
        ])
		.then(function() {
			mongoose.disconnect(function() {
				nextCase();
			});
		})
		.catch(errFn);
	});
	describe('#find',function() {
		it('should find All', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			categoryDAO.findAll(new Done(dataFn, errFn))
			function dataFn(categorys) {
				debug('findAll : ',categorys);
				should.equal(categorys[0].title , 'root')
				nextTest()
			}
		});
		/////////// 이것만 카테고리 서비스다. 햇갈리지말것.
		describe('#categoryService',function() {
			it('should get rootOfCategoryTree', function (nextTest) {
				var errFn = H.testCatch1(nextTest);
				categoryService.getRootOfCategoryTree(new Done(dataFn, errFn))
				function dataFn(rootOfCategoryTree) {
					debug('rootOfCategoryTree : ',rootOfCategoryTree);
					should.equal(rootOfCategoryTree.categories[0].title , 'title1')
					nextTest()
				}
			});
		})
		it('should return bool hasDuplicateChildTitleFromParent', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var parent = Category.makeRoot()
			, title = 'title1';
			categoryDAO.hasDuplicateChildTitleFromParent(new Done(dataFn, errFn), parent, title)
			function dataFn(hasDuplicateChildTitle) {
//				debug('hasDuplicateChildTitleFromParent : ',hasDuplicateChildTitle)
				should.equal(hasDuplicateChildTitle, true);
				nextTest()
			}
		});
		it('should get all child id from parentId', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var id = Category.getRootId();
			
			categoryDAO.findIdsOfIncludeChildIdAndAllCategories(new Done(dataFn, errFn), id)
			
			function dataFn(args) {
				debug('category ids ', args);
				should.equal(args.allCategories.length, 3)
				should.equal(args.categoryIds.length, 3)
				nextTest();
			}
		})
		
	})
	describe('#insert',function() {
		it('should handle err if insert a category with duplicate title category have same parent', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var parent = Category.makeRoot()
			  , title = 'title1';
			
			categoryDAO.insertChildToParentByTitle(new Done(dataFn, errFn), parent, title)
			function dataFn(status) {
				debug('insert err : ', status)
				should.equal(status.isError() , true);
				nextTest();
			}
		})
		it('should insert success ChildToParentByTitle', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var parent = Category.makeRoot()
			, title = 'title123';
			
			categoryDAO.insertChildToParentByTitle(new Done(dataFn, errFn), parent, title)
			function dataFn(status) {
				should.equal(status.isSuccess() , true);
				nextTest();
			}
		})
	})
	describe('#update',function() {
		it('should take errString update by already exist title', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , category = _.findWhere(categories, {title: 'title2'})
			  , alreadyExistTitle = 'title1';
			categoryDAO.updateTitleByCategory(new Done(dataFn, errFn), category, alreadyExistTitle)
			function dataFn(status) {
				debug('update err : ', status.getMessage())
				should.equal(status.isError(),true);
				nextTest();
			}
		});
		it('should take success by new title', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			, category = _.findWhere(categories, {title: 'title2'})
			, newTitle = 'newTitle';
			categoryDAO.updateTitleByCategory(new Done(dataFn, errFn), category, newTitle)
			function dataFn(status) {
//				debug('update message : ', arguments)
				should.equal(status.isSuccess(), true);
				nextTest();
			}
		});
//		it('update postCount', function (nextTest) {
//			//테스트 데이터 넣을때 확인한 것으로 생략
//		})
		
	})
	describe('#delete',function() {
		it('should delete fail with category have postcount > 0', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , categoryIsPostCountIsNotZero = _.findWhere(categories,{postCount : 1})
			  , id = categoryIsPostCountIsNotZero.id;
			categoryDAO.removeById(new Done(dataFn, errFn), id);
			function dataFn(status) {
//				console.log(status.getMessage())

				should.equal(status.isError(), true)
				should.exist(status.getMessage().match('category has post'))
				nextTest();
			}
		});
		it('should delete success with category', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , cagegoryBeHaveChild = _.findWhere(categories, {title : 'title1'})
			  , id = cagegoryBeHaveChild.id;
			categoryDAO.removeById(new Done(dataFn, errFn), id);
			function dataFn(status) {
//				console.log(status.getMessage())

				should.equal(status.isSuccess(), true)
				nextTest();
			}
		})
	})
	
	
})


/////////
function _insertAllTestData(dataFn) {
	
	H.call4promise(initDataCreater.create)
	.then(function () {
		return H.call4promise(categoryDAO.insertChildToParentByTitle, Category.makeRoot(), 'title1') 
	})
	 .then(function () {
		return H.call4promise(categoryDAO.insertChildToParentByTitle, Category.makeRoot(), 'title2') 
	 })
	 .then(function () {
		 return H.call4promise(categoryDAO.increasePostCountById, Category.getRootId()) 
	 })
	 .then(dataFn)
};
