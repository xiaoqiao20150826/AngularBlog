/**
 * 
 */

var should = require('should')
  , _ = require('underscore');

var H = require('../testHelper.js')
  , Done = H.Done
  , categoryDAO = require('../../dao/categoryDAO.js')
  , Category= require('../../domain/Category.js');

var log = require('debug')('dao:categoryTest');

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
//					log('inserted categories : ',_categories)
					categories =  _categories;
					nextTest();
				}
			}
		})
	})
	after(function(nextTest) {
		H.call4promise(categoryDAO.removeAll)
		.then(function() {
			mongoose.disconnect(function(d) {
				nextTest();
			});
		});
	})
	describe('#find',function() {
		it('should find All', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			categoryDAO.findAll(new Done(dataFn, errFn))
			function dataFn(categorys) {
//				log('findAll : ',categorys);
				should.equal(categorys[0].title , 'title1')
				nextTest()
			}
		});
		it('should return bool hasDuplicateChildTitleFromParent', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var parent = Category.getRoot()
			, title = 'title1';
			categoryDAO.hasDuplicateChildTitleFromParent(new Done(dataFn, errFn), parent, title)
			function dataFn(hasDuplicateChildTitle) {
//				log('hasDuplicateChildTitleFromParent : ',hasDuplicateChildTitle)
				should.equal(hasDuplicateChildTitle, true);
				nextTest()
			}
		});
		
	})
	describe('#insert',function() {
		it('should handle err if insert a category with duplicate title category have same parent', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var parent = Category.getRoot()
			  , title = 'title1';
			
			categoryDAO.insertChildToParentByTitle(new Done(dataFn, errFn), parent, title)
			function dataFn(categoryOrErrString) {
//				log('insert err : ', categoryOrErrString)
				should.equal(_.isString(categoryOrErrString) , true);
				nextTest();
			}
		})
		it('should insert ChildToParentByTitle', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var parent = Category.getRoot()
			, title = 'title123';
			
			categoryDAO.insertChildToParentByTitle(new Done(dataFn, errFn), parent, title)
			function dataFn(categoryOrErrString) {
//				log('insert err : ', categoryOrErrString)
				should.equal(categoryOrErrString.title , title);
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
			function dataFn(successMessageOrErrString) {
//				log('update err : ', successMessageOrErrString)
				should.exist(successMessageOrErrString.match('already exist '));
				nextTest();
			}
		});
		it('should take success by new title', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			, category = _.findWhere(categories, {title: 'title2'})
			, newTitle = 'newTitle';
			categoryDAO.updateTitleByCategory(new Done(dataFn, errFn), category, newTitle)
			function dataFn(successMessageOrErrString) {
//				log('update message : ', arguments)
				should.equal(successMessageOrErrString,'success');
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
			function dataFn(stringErrOrSussecc) {
				should.exist(stringErrOrSussecc.match('category has post'))
				nextTest();
			}
		});
		it('should delete fail with category have child', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , cagegoryBeHaveChild = _.findWhere(categories, {title: 'hasChild'})
			  , id = cagegoryBeHaveChild.id;
			categoryDAO.removeById(new Done(dataFn, errFn), id);
			function dataFn(stringErrOrSussecc) {
				should.exist(stringErrOrSussecc.match('category has child categories'))
				nextTest();
			}
		})
		it('should delete success whit category if abobe case else', function (nextTest) {
			var errFn = H.testCatch1(nextTest)
			  , nomalCategory = _.findWhere(categories, {title: 'title1'})
			  , id = nomalCategory.id;
			categoryDAO.removeById(new Done(dataFn, errFn), id);
			function dataFn(SusseccMessage) {
				should.exist(SusseccMessage.match('success'))
				nextTest();
			}
		});
	})
	
	
})


/////////
function _insertAllTestData(dataFn) {
	var root = Category.getRoot();
	
	H.call4promise(categoryDAO.insertChildToParentByTitle, root, 'title1')
	 .then(function () {
		return H.call4promise(categoryDAO.insertChildToParentByTitle, root, 'title2') 
	 })
	 .then(function (category) {
		 return H.call4promise(categoryDAO.increasePostCountById, category.id)  
	 })
	 .then(function () {
		 return H.call4promise(categoryDAO.insertChildToParentByTitle, root, 'hasChild')
	 })
	 .then(function (parent) {
		 return H.call4promise(categoryDAO.insertChildToParentByTitle, parent, 'childTitle')		 
	 })
	 .then(dataFn)
};
