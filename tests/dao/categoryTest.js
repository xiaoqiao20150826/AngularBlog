/**
 * 
 */

var should = require('should')
  , _ = require('underscore');

var H = require('../testHelper.js')
  , Done = H.Done
  , categoryDAO = require('../../dao/categoryDAO.js')
  , Category= require('../../domain/Category.js');


var _title = 'gggggggggg';
describe('categoryDAO', function() {
	var mongoose = require('mongoose');
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertAllTestData(nextTest);
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
		it('should find by title', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			categoryDAO.findAll(new Done(dataFn, errFn))
			function dataFn(categorys) {
				should.equal(categorys.length, 2)
				nextTest()
			}
		});
		it('should find by title', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			categoryDAO.findByTitle(new Done(dataFn, errFn), _title)
			function dataFn(category) {
				should.equal(category.title, _title);
				nextTest()
			}
		});
	})
	describe('#insert',function() {
		it('should insert a category', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var category = Category.createBy({title: 'cate1231'})
			
			categoryDAO.insertOne(new Done(dataFn, errFn), category)
			function dataFn(category) {
				should.equal(category.title , 'cate1231');
				nextTest();
			}
		})
		it('should catch err if insert a category same title', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var category = Category.createBy({title: 'cate1231'})
			categoryDAO.insertOne(new Done(dataFn, errFn), category)
			function dataFn(category) {
				should.equal(category.title, '')
				nextTest();
			}
		})
		it('should insert a category by not parentTitle', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var category = Category.createBy({title: 'cate111231'})
			  , parentTitle = '--기본--';
			categoryDAO.insertByParentTitle(new Done(dataFn, errFn), category, parentTitle)
			function dataFn(category) {
				should.equal(category.title, 'cate111231')
				nextTest();
			}
		})
	})
	describe('#update',function() {
		it('should push childTitle to category', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var toCategory = Category.createBy({title: 'cate111231'})
			var childTitle = 'wfwefwfeew';
			categoryDAO.pushChildTitleToCategory(new Done(dataFn, errFn), childTitle, toCategory)
			function dataFn(bool) {
				should.equal(1,bool)
				categoryDAO.findByTitle(new Done(dataFn2, errFn), toCategory.title)
				function dataFn2(category2) {
					should.equal(category2.childTitles.pop(), childTitle)
					nextTest()
				}
			}
		});
		it('should remove childTitle from category', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			var fromCategory = Category.createBy({title: 'cate111231'})
			var childTitle = 'wfwefwfeew';
			categoryDAO.removeChildTitleFromCategory(new Done(dataFn, errFn), childTitle, fromCategory)
			function dataFn(bool) {
				should.equal(1,bool)
				categoryDAO.findByTitle(new Done(dataFn2, errFn), fromCategory.title)
				function dataFn2(category2) {
					should.deepEqual(category2.childTitles, [])
					nextTest()
				}
			}
		});
	})
	describe('#delete',function() {
		it('should delete a category by title', function (nextTest) {
			var errFn = H.testCatch1(nextTest);
			categoryDAO.removeByTitle(new Done(dataFn, errFn), _title)
			function dataFn(bool) {
				should.equal(bool,1)
				nextTest();
			}
		});
//		it('should push childTitle to category', function (nextTest) {
//			var errFn = H.testCatch1(nextTest);
//			var toCategory = Category.createBy({title: 'cate111231'})
//			var childTitle = 'wfwefwfeew';
//			categoryDAO.pushChildTitleToCategory(new Done(dataFn, errFn), childTitle, toCategory)
//			function dataFn(bool) {
//				should.equal(1,bool)
//				categoryDAO.findByTitle(new Done(dataFn2, errFn), toCategory.title)
//				function dataFn2(category2) {
//					should.equal(category2.childTitles.pop(), childTitle)
//					nextTest()
//				}
//			}
//		});
	})
	
	
})


/////////
function _insertAllTestData(nextTest) {
	var errFn = H.testCatch1(nextTest);
	var category1 = Category.createBy({title: _title})
	var category2 = Category.createBy({title: _title+2})
	
	H.call4promise(categoryDAO.insertOne, category1)
	 .then(function () {
		H.call4promise(categoryDAO.insertOne, category2) 
	 })
	 .then(dataFn)
	 .catch(errFn)
	function dataFn() {
		nextTest();
	}
};
